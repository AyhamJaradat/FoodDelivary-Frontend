import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MealCardComponent } from './meal-card.component';

describe('MealCardComponent', () => {
  let component: MealCardComponent;
  let fixture: ComponentFixture<MealCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MealCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MealCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
