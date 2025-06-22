export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cama: {
        Row: {
          estado: string | null
          id: string
          id_sector: string
          identificador: string
        }
        Insert: {
          estado?: string | null
          id?: string
          id_sector: string
          identificador: string
        }
        Update: {
          estado?: string | null
          id?: string
          id_sector?: string
          identificador?: string
        }
        Relationships: [
          {
            foreignKeyName: "cama_id_sector_fkey"
            columns: ["id_sector"]
            isOneToOne: false
            referencedRelation: "sector"
            referencedColumns: ["id"]
          },
        ]
      }
      internacion: {
        Row: {
          fecha_alta: string | null
          fecha_ingreso: string
          fin_de_vida: boolean | null
          grave: boolean | null
          id: string
          id_cama: string | null
          id_paciente: string
          inmunocomprometido: boolean | null
          internacion_urgente: boolean
          internado_ultimos_30_dias: boolean | null
          leucemia: boolean | null
          oncologico: boolean | null
          razon_ingreso: string
          sector_id: string | null
        }
        Insert: {
          fecha_alta?: string | null
          fecha_ingreso: string
          fin_de_vida?: boolean | null
          grave?: boolean | null
          id?: string
          id_cama?: string | null
          id_paciente: string
          inmunocomprometido?: boolean | null
          internacion_urgente: boolean
          internado_ultimos_30_dias?: boolean | null
          leucemia?: boolean | null
          oncologico?: boolean | null
          razon_ingreso: string
          sector_id?: string | null
        }
        Update: {
          fecha_alta?: string | null
          fecha_ingreso?: string
          fin_de_vida?: boolean | null
          grave?: boolean | null
          id?: string
          id_cama?: string | null
          id_paciente?: string
          inmunocomprometido?: boolean | null
          internacion_urgente?: boolean
          internado_ultimos_30_dias?: boolean | null
          leucemia?: boolean | null
          oncologico?: boolean | null
          razon_ingreso?: string
          sector_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_internacion_paciente"
            columns: ["id_paciente"]
            isOneToOne: false
            referencedRelation: "paciente"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internacion_id_cama_fkey"
            columns: ["id_cama"]
            isOneToOne: false
            referencedRelation: "cama"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internacion_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sector"
            referencedColumns: ["id"]
          },
        ]
      }
      paciente: {
        Row: {
          apellido: string | null
          DNI: string | null
          edad: number | null
          genero: string | null
          id: string
          nombre: string
          obra_social: string | null
        }
        Insert: {
          apellido?: string | null
          DNI?: string | null
          edad?: number | null
          genero?: string | null
          id?: string
          nombre: string
          obra_social?: string | null
        }
        Update: {
          apellido?: string | null
          DNI?: string | null
          edad?: number | null
          genero?: string | null
          id?: string
          nombre?: string
          obra_social?: string | null
        }
        Relationships: []
      }
      Prioridades_internacion: {
        Row: {
          cama_id: string | null
          id: number
          paciente_id: string | null
          puntaje: number | null
        }
        Insert: {
          cama_id?: string | null
          id?: number
          paciente_id?: string | null
          puntaje?: number | null
        }
        Update: {
          cama_id?: string | null
          id?: number
          paciente_id?: string | null
          puntaje?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Prioridades_internacion_cama_id_fkey"
            columns: ["cama_id"]
            isOneToOne: false
            referencedRelation: "cama"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Prioridades_internacion_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "paciente"
            referencedColumns: ["id"]
          },
        ]
      }
      sector: {
        Row: {
          id: string
          nombre: string
        }
        Insert: {
          id?: string
          nombre?: string
        }
        Update: {
          id?: string
          nombre?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
