import { ref } from "vue";
import type { GqlError } from "nuxt-graphql-client";

// Interfaz para AttendanceRecord basada en el esquema GraphQL
interface AttendanceRecord {
  _id: string;
  week: string;
  date: string;
  topic: string;
  hours: number;
  group: string;
  classType: string;
  other: string | null;
  observations: string | null;
  advisorSignature: string;
  tutorSignature: string;
  protocolId: string;
  submittedBy: string;
}

interface Protocol {
  _id: string;
  courseId: string;
  name: string;
  module: string;
  formId: string;
  createdAt: string;
}

export function useAttendanceForm() {
  const records = ref<AttendanceRecord[]>([]); // Definir tipo explícito
  const protocols = ref<Protocol[]>([]);
  const formData = ref({
    teacherName: "",
    advisorName: "",
    institution: "",
    tutorName: "",
    assignedGroups: "",
    records: [
      {
        protocolId: "",
        week: "",
        date: "",
        topic: "",
        hours: 0,
        group: "",
        classType: "",
        other: "",
        observations: "",
        advisorSignature: "",
        tutorSignature: "",
      },
    ],
  });

  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchProtocols(courseId: string) {
    if (!courseId) {
      error.value = "Course ID is required";
      console.error("Error: Course ID is missing");
      return;
    }
    try {
      loading.value = true;
      const response = await GqlProtocols({ courseId });
      protocols.value = response.protocols || [];
    } catch (err: unknown) {
      const gqlError = err as { message?: string; gqlErrors?: GqlError[] };
      error.value = gqlError.message || "Error fetching protocols";
      console.error("Error al obtener protocolos:", err);
      if (gqlError.gqlErrors) {
        console.error(
          "GraphQL Errors:",
          JSON.stringify(gqlError.gqlErrors, null, 2)
        );
      }
    } finally {
      loading.value = false;
    }
  }

  async function fetchRecords(protocolId: string) {
    if (!protocolId) {
      error.value = "Protocol ID is required";
      console.error("Error: Protocol ID is missing");
      return;
    }
    try {
      loading.value = true;
      const response = await GqlAttendanceRecords({ protocolId });
      records.value = response.attendanceRecords || [];
    } catch (err: unknown) {
      const gqlError = err as { message?: string; gqlErrors?: GqlError[] };
      error.value = gqlError.message || "Error fetching records";
      console.error("Error al obtener registros:", err);
      if (gqlError.gqlErrors) {
        console.error(
          "GraphQL Errors:",
          JSON.stringify(gqlError.gqlErrors, null, 2)
        );
      }
    } finally {
      loading.value = false;
    }
  }

  async function submitForm() {
    try {
      loading.value = true;
      for (const record of formData.value.records) {
        if (!record.protocolId) {
          throw new Error("Protocol ID is required for each record");
        }
        await GqlCreateAttendanceRecord({
          createAttendanceRecordInput: {
            protocolId: record.protocolId,
            week: record.week,
            date: record.date,
            topic: record.topic,
            hours: record.hours,
            group: record.group,
            classType: record.classType,
            other: record.other,
            observations: record.observations,
            advisorSignature: record.advisorSignature,
            tutorSignature: record.tutorSignature,
          },
        });
      }
      const response = await GqlGenerateAttendancePDF({
        input: {
          teacherName: formData.value.teacherName,
          advisorName: formData.value.advisorName,
          institution: formData.value.institution,
          tutorName: formData.value.tutorName,
          assignedGroups: formData.value.assignedGroups,
          records: formData.value.records,
        },
      });
      const base64Data = response.generateAttendancePDF.replace(
        "data:application/pdf;base64,",
        ""
      );
      const binary = atob(base64Data);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([array], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "control-asistencia.pdf";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const gqlError = err as { message?: string; gqlErrors?: GqlError[] };
      error.value = gqlError.message || "Error submitting form";
      console.error("Error al enviar el formulario:", err);
      if (gqlError.gqlErrors) {
        console.error(
          "GraphQL Errors:",
          JSON.stringify(gqlError.gqlErrors, null, 2)
        );
      }
    } finally {
      loading.value = false;
    }
  }

  return {
    formData,
    records,
    protocols,
    loading,
    error,
    submitForm,
    fetchRecords,
    fetchProtocols,
  };
}
