import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TitulosPage } from './titulos.page';

describe('TitulosPage', () => {
  let component: TitulosPage;
  let fixture: ComponentFixture<TitulosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitulosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TitulosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
