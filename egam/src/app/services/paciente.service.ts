import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Paciente } from '../models/paciente';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  selectedPaciente: Paciente;
  pacientes: Paciente[];

  readonly URL_API = 'http://localhost:3000/api/pacientes';

  constructor(private http: HttpClient) {
    this.selectedPaciente = new Paciente();
  }

  postPaciente(paciente: Paciente) {
    return this.http.post(this.URL_API, paciente);
  }

  getPacientes() {
    return this.http.get(this.URL_API);
  }

  putPaciente(paciente: Paciente) {
    return this.http.put(this.URL_API + `/${paciente._id}`, paciente);
  }

  deletePaciente(_id: string) {
    return this.http.delete(this.URL_API + `/${_id}`);
  }
}
