import { redirect } from "next/navigation";
import { getAuthenticatedStudent } from "@/lib/student";
import { prisma } from "@/lib/prisma";
import { FaceEnrollmentKiosk } from "@/components/student/FaceEnrollmentKiosk";
import { ScanFace, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentEnrollPage() {
  const authData = await getAuthenticatedStudent();

  if (!authData) {
    redirect("/login?role=student");
  }

  const { student } = authData;

  // Retrieve current biometric enrollment details
  const biometricData = await prisma.student.findUnique({
    where: { id: student.id },
    select: {
      faceEnrolled: true,
      faceEmbedding: {
        select: {
          updatedAt: true,
        },
      },
    },
  });

  const isEnrolled = biometricData?.faceEnrolled ?? false;
  const enrolledAt = biometricData?.faceEmbedding?.updatedAt
    ? biometricData.faceEmbedding.updatedAt.toISOString()
    : null;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <ScanFace className="w-6 h-6 text-cyan-400" />
            <span>Face Biometric Enrollment</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Register your facial feature vector for automated classroom attendance verification
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 w-fit">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Encrypted Numerical Vector Storage</span>
        </div>
      </div>

      {/* Interactive Kiosk */}
      <FaceEnrollmentKiosk
        initialEnrolled={isEnrolled}
        initialEnrolledAt={enrolledAt}
      />
    </div>
  );
}
