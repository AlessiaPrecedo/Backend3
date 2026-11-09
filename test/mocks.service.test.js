import { expect } from "chai";
import { describe, it } from "mocha";
import { MocksService } from "../src/services/mocks.service.js";

describe("MocksService", () => {
  it("generates the requested mock data with linked references", () => {
    const quantity = 6;
    const bundle = MocksService.generateBundle(quantity);
    const customerIds = new Set(bundle.users.map(({ _id }) => _id.toString()));
    const orderIds = new Set(bundle.orders.map(({ _id }) => _id.toString()));
    const driverIds = new Set(bundle.drivers.map(({ _id }) => _id.toString()));

    expect(bundle.users).to.have.lengthOf(quantity);
    expect(bundle.drivers).to.have.lengthOf(Math.ceil(quantity / 3));
    expect(bundle.orders).to.have.lengthOf(quantity);
    expect(bundle.deliveries.length).to.be.at.most(quantity);

    for (const order of bundle.orders) {
      expect(customerIds.has(order.customer.toString())).to.equal(true);
      if (order.delivery) {
        expect(
          bundle.deliveries.some(
            (delivery) => delivery._id.toString() === order.delivery.toString(),
          ),
        ).to.equal(true);
      }
    }

    for (const delivery of bundle.deliveries) {
      expect(orderIds.has(delivery.order.toString())).to.equal(true);
      if (delivery.driver) {
        expect(driverIds.has(delivery.driver.toString())).to.equal(true);
      }
    }
  });

  it("rejects quantities outside the supported range", () => {
    expect(() => MocksService.generateBundle(-1))
      .to.throw()
      .with.property("code", "INVALID_MOCK_AMOUNT");
  });
});
