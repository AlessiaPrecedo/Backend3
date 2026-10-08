import assert from "node:assert/strict";
import test from "node:test";
import { MocksService } from "../src/services/mocks.service.js";

test("generateBundle returns the requested mock data with linked references", () => {
  const quantity = 6;
  const bundle = MocksService.generateBundle(quantity);
  const customerIds = new Set(bundle.users.map(({ _id }) => _id.toString()));
  const orderIds = new Set(bundle.orders.map(({ _id }) => _id.toString()));
  const driverIds = new Set(bundle.drivers.map(({ _id }) => _id.toString()));

  assert.equal(bundle.users.length, quantity);
  assert.equal(bundle.drivers.length, Math.ceil(quantity / 3));
  assert.equal(bundle.orders.length, quantity);
  assert.ok(bundle.deliveries.length <= quantity);

  for (const order of bundle.orders) {
    assert.ok(customerIds.has(order.customer.toString()));
    if (order.delivery) {
      assert.ok(
        bundle.deliveries.some(
          (delivery) => delivery._id.toString() === order.delivery.toString(),
        ),
      );
    }
  }

  for (const delivery of bundle.deliveries) {
    assert.ok(orderIds.has(delivery.order.toString()));
    if (delivery.driver) {
      assert.ok(driverIds.has(delivery.driver.toString()));
    }
  }
});

test("generate rejects quantities outside the supported range", () => {
  assert.throws(
    () => MocksService.generateBundle(-1),
    (error) => error.code === "INVALID_MOCK_AMOUNT" && error.statusCode === 400,
  );
});
