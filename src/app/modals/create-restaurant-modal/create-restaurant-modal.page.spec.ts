import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateRestaurantModalPage } from './create-restaurant-modal.page';

describe('CreateRestaurantModalPage', () => {
  let component: CreateRestaurantModalPage;
  let fixture: ComponentFixture<CreateRestaurantModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRestaurantModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateRestaurantModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
