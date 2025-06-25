// stores/formBuilderStore.ts
import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";
import {
  GqlProtocol,
  GqlProtocols,
  GqlCreateProtocol,
  GqlCreateAttendanceRecord,
} from "#gql";

export const useFormBuilderStore = defineStore("formBuilder", {
  state: () => ({
    courses: [] as any[],
    currentCourse: null as any | null,
    protocols: [] as any[],
    currentProtocol: null as any | null,
    forms: [] as any[],
    currentForm: null as any | null,
  }),
  actions: {
    async fetchCourse(courseId: string) {
      // Implementación existente
      this.currentCourse = {
        _id: courseId,
        name: "Informática y Tecnología - Grado 7°",
        institution: "Colegio Educativo La Esperanza",
        assignedGroups: ["7°A", "7°B"],
      };
    },
    async fetchProtocols(courseId: string) {
      try {
        const { protocols } = await GqlProtocols({ courseId });
        this.protocols = protocols;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    async fetchProtocol(protocolId: string) {
      try {
        const { protocol } = await GqlProtocol({ id: protocolId });
        this.currentProtocol = protocol;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    async fetchForms() {
      // Implementación existente
      this.forms = [
        { _id: "mockFormId", name: "Formulario de Control de Asistencia" },
      ];
    },
    async fetchForm(formId: string) {
      // Implementación existente
      this.currentForm = {
        _id: formId,
        name: "Formulario de Control de Asistencia",
      };
    },
    async createCourse(courseData: any) {
      // Implementación existente
    },
    async createProtocol(protocolData: any) {
      const authStore = useAuthStore();
      if (!authStore.user?._id) {
        throw new Error("Usuario no autenticado");
      }
      try {
        const { createProtocol } = await GqlCreateProtocol({
          createProtocolInput: {
            ...protocolData,
            createdBy: authStore.user._id,
          },
        });
        this.protocols.push(createProtocol);
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    async createAttendanceRecord(attendanceData: any) {
      const authStore = useAuthStore();
      if (!authStore.user?._id) {
        throw new Error("Usuario no autenticado");
      }
      try {
        const { createAttendanceRecord } = await GqlCreateAttendanceRecord({
          createAttendanceRecordInput: {
            ...attendanceData,
          },
        });
        const protocol = this.protocols.find(
          (p) => p._id === attendanceData.protocolId
        );
        if (protocol) {
          protocol.attendanceRecords.push(createAttendanceRecord);
        }
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    async submitProtocol(submissionData: any) {
      // Implementación existente
    },
  },
});
