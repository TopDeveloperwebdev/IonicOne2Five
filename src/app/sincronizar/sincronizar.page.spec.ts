import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SincronizarPage } from './sincronizar.page';

describe('SincronizarPage', () => {
  let component: SincronizarPage;
  let fixture: ComponentFixture<SincronizarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SincronizarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SincronizarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
