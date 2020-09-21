import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PdfRenderComponent } from './pdf-render.component';

describe('PdfRenderComponent', () => {
  let component: PdfRenderComponent;
  let fixture: ComponentFixture<PdfRenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfRenderComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PdfRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
