
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PatientData {
  nombre: string;
  apellido: string;
  DNI: string;
  edad: number;
  genero: string;
  obra_social: string;
}

interface PersonalDataFormProps {
  data: PatientData;
  onComplete: (data: PatientData) => void;
}

export function PersonalDataForm({ data, onComplete }: PersonalDataFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PatientData>({
    defaultValues: data
  });

  const onSubmit = (formData: PatientData) => {
    onComplete(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos Personales del Paciente</CardTitle>
        <CardDescription>
          Ingrese la información básica del paciente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                {...register('nombre', { required: 'El nombre es obligatorio' })}
                placeholder="Nombre del paciente"
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                {...register('apellido')}
                placeholder="Apellido del paciente"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="DNI">DNI *</Label>
              <Input
                id="DNI"
                {...register('DNI', { 
                  required: 'El DNI es obligatorio',
                  pattern: {
                    value: /^\d{7,8}$/,
                    message: 'DNI debe tener 7 u 8 dígitos'
                  }
                })}
                placeholder="12345678"
              />
              {errors.DNI && (
                <p className="text-sm text-red-500">{errors.DNI.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edad">Edad</Label>
              <Input
                id="edad"
                type="number"
                {...register('edad', { 
                  valueAsNumber: true,
                  min: { value: 0, message: 'La edad debe ser mayor a 0' },
                  max: { value: 120, message: 'La edad debe ser menor a 120' }
                })}
                placeholder="25"
              />
              {errors.edad && (
                <p className="text-sm text-red-500">{errors.edad.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="genero">Género</Label>
              <Select onValueChange={(value) => setValue('genero', value)} defaultValue={data.genero}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="femenino">Femenino</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="obra_social">Obra Social</Label>
              <Input
                id="obra_social"
                {...register('obra_social')}
                placeholder="OSDE, Swiss Medical, etc."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Continuar a Datos Clínicos
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
