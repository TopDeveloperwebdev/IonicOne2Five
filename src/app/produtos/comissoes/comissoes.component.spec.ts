import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComissoesComponent } from './comissoes.component';

describe('ComissoesComponent', () => {
  let component: ComissoesComponent;
  let fixture: ComponentFixture<ComissoesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComissoesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ComissoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
