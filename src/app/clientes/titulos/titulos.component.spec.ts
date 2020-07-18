import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TitulosComponent } from './titulos.component';

describe('TitulosComponent', () => {
  let component: TitulosComponent;
  let fixture: ComponentFixture<TitulosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitulosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TitulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
