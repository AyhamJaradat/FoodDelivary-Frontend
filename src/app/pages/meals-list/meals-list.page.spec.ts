import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MealsListPage } from './meals-list.page';

describe('MealsListPage', () => {
  let component: MealsListPage;
  let fixture: ComponentFixture<MealsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MealsListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MealsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
