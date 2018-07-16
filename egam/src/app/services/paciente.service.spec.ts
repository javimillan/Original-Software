import { TestBed, inject } from '@angular/core/testing';

import { pacienteService } from './paciente.service';

describe('pacienteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [pacienteService]
    });
  });

  it('should be created', inject([pacienteService], (service: pacienteService) => {
    expect(service).toBeTruthy();
  }));
});
