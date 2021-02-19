import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrdersListPage } from './orders-list.page';

describe('OrdersListPage', () => {
  let component: OrdersListPage;
  let fixture: ComponentFixture<OrdersListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
