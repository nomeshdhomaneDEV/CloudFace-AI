/**
 * CloudFace AI - Administrator Provisioning Script
 *
 * Securely provisions a verified Administrator account into both Supabase Auth
 * and the PostgreSQL database (via Prisma) with role: ADMIN.
 *
 * Usage:
 *   npx tsx scripts/create-admin.ts [email] [password] [fullName]
 *
 * Environment variables required in .env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY)
 *   DATABASE_URL
 *   DIRECT_URL
 */

import { createClient } from "@supabase/supabase-js";
import { PrismaClient, Role } from "@prisma/client";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  console.error("❌ Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env");
  console.error("Please add SUPABASE_SECRET_KEY (Service Role Secret Key from Supabase Dashboard -> Project Settings -> API) to your .env file.");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const email = (args[0] || process.env.ADMIN_EMAIL || "admin@cloudface.edu").toLowerCase().trim();
  const password = args[1] || process.env.ADMIN_PASSWORD || "Admin@CloudFace2026";
  const fullName = args[2] || process.env.ADMIN_NAME || "System Administrator";

  console.log("==================================================");
  console.log("   CloudFace AI — Administrator Provisioning      ");
  console.log("==================================================");
  console.log(`Target Email: ${email}`);
  console.log(`Full Name:    ${fullName}`);
  console.log("--------------------------------------------------");

  try {
    let authUserId: string;

    // 1. Check if user exists in Supabase Auth
    const { data: userList, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      throw new Error(`Failed to query Supabase Auth users: ${listError.message}`);
    }

    const existingUser = userList.users.find((u) => u.email?.toLowerCase() === email);

    if (existingUser) {
      console.log(`ℹ️  Supabase Auth user exists with ID: ${existingUser.id}`);
      authUserId = existingUser.id;

      // Update metadata & password
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(authUserId, {
        password,
        email_confirm: true,
        user_metadata: {
          role: "ADMIN",
          full_name: fullName,
        },
      });

      if (updateError) {
        throw new Error(`Failed to update existing auth user: ${updateError.message}`);
      }
      console.log("✅ Supabase Auth user updated with ADMIN role and verified status.");
    } else {
      // Create new user in Supabase Auth
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role: "ADMIN",
          full_name: fullName,
        },
      });

      if (createError || !newUser.user) {
        throw new Error(`Failed to create Supabase Auth user: ${createError?.message}`);
      }

      authUserId = newUser.user.id;
      console.log(`✅ Supabase Auth user created successfully with ID: ${authUserId}`);
    }

    // 2. Upsert Profile in Prisma PostgreSQL
    const profile = await prisma.profile.upsert({
      where: { email },
      create: {
        id: authUserId,
        email,
        fullName,
        role: Role.ADMIN,
      },
      update: {
        id: authUserId,
        fullName,
        role: Role.ADMIN,
      },
    });

    console.log(`✅ Prisma database profile verified: Role = ${profile.role}`);

    // 3. Log provision action
    await prisma.adminActivityLog.create({
      data: {
        adminId: profile.id,
        action: "ADMIN_PROVISIONED",
        description: `Administrator account provisioned: ${email}`,
      },
    });

    console.log("--------------------------------------------------");
    console.log("🎉 SUCCESS! Administrator account is ready:");
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Portal:   http://localhost:3000/login?role=admin`);
    console.log("==================================================");
  } catch (error) {
    console.error("❌ Failed to provision admin:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
