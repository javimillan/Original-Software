import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { pacienteComponent } from './paciente.component';

describe('pacienteComponent', () => {
  let component: pacienteComponent;
  let fixture: ComponentFixture<pacienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ pacienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(pacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
