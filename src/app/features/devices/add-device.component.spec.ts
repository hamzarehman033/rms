import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddDeviceComponent } from './add-device.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';

describe('AddDeviceComponent', () => {
  let component: AddDeviceComponent;
  let fixture: ComponentFixture<AddDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddDeviceComponent,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        InputNumberModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values except battery', () => {
    expect(component.deviceForm.get('deviceName')?.value).toBe('');
    expect(component.deviceForm.get('battery')?.value).toBe(100);
  });

  it('should emit deviceAdded when form is submitted with valid data', () => {
    spyOn(component.deviceAdded, 'emit');
    
    component.deviceForm.patchValue({
      deviceName: 'Test Device',
      deviceId: 'DV-001',
      deviceType: 'sensor',
      location: 'Test Location',
      battery: 80
    });

    component.onSubmit();

    expect(component.deviceAdded.emit).toHaveBeenCalledWith({
      deviceName: 'Test Device',
      deviceId: 'DV-001',
      deviceType: 'sensor',
      location: 'Test Location',
      battery: 80
    });
  });

  it('should not emit when form is invalid', () => {
    spyOn(component.deviceAdded, 'emit');
    component.onSubmit();
    expect(component.deviceAdded.emit).not.toHaveBeenCalled();
  });

  it('should reset form when resetForm is called', () => {
    component.deviceForm.patchValue({
      deviceName: 'Test Device',
      deviceId: 'DV-001',
      deviceType: 'sensor',
      location: 'Test Location',
      battery: 50
    });

    component.resetForm();

    expect(component.deviceForm.get('deviceName')?.value).toBeNull();
    expect(component.deviceForm.get('battery')?.value).toBe(100);
  });
});
