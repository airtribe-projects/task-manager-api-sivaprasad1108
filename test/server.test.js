const tap = require("tap");
const supertest = require("supertest");
const app = require("../app");
const server = supertest(app);

tap.test("POST /tasks", async (t) => {
  const newTask = {
    title: "New Task",
    description: "New Task Description",
    completed: false,
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 201);
  t.end();
});

tap.test("POST /tasks with invalid data", async (t) => {
  const newTask = {
    title: "New Task",
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 400);
  t.end();
});

tap.test("GET /tasks", async (t) => {
  const response = await server.get("/tasks");
  t.equal(response.status, 200);
  t.hasOwnProp(response.body[0], "id");
  t.hasOwnProp(response.body[0], "title");
  t.hasOwnProp(response.body[0], "description");
  t.hasOwnProp(response.body[0], "completed");
  t.type(response.body[0].id, "number");
  t.type(response.body[0].title, "string");
  t.type(response.body[0].description, "string");
  t.type(response.body[0].completed, "boolean");
  t.end();
});

tap.test("GET /tasks/:id", async (t) => {
  const response = await server.get("/tasks/1");
  t.equal(response.status, 200);
  const expectedTask = {
    id: 1,
    title: "Set up environment",
    description: "Install Node.js, npm, and git",
    completed: true,
  };
  t.match(response.body, expectedTask);
  t.end();
});

tap.test("GET /tasks/:id with invalid id", async (t) => {
  const response = await server.get("/tasks/999");
  t.equal(response.status, 404);
  t.end();
});

tap.test("PUT /tasks/:id", async (t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated Task Description",
    completed: true,
  };
  const response = await server.put("/tasks/1").send(updatedTask);
  t.equal(response.status, 200);
  t.end();
});

tap.test("PUT /tasks/:id with invalid id", async (t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated Task Description",
    completed: true,
  };
  const response = await server.put("/tasks/999").send(updatedTask);
  t.equal(response.status, 404);
  t.end();
});

tap.test("PUT /tasks/:id with invalid data", async (t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated Task Description",
    completed: "true",
  };
  const response = await server.put("/tasks/1").send(updatedTask);
  t.equal(response.status, 400);
  t.end();
});

tap.test("DELETE /tasks/:id", async (t) => {
  const response = await server.delete("/tasks/1");
  t.equal(response.status, 200);
  t.end();
});

tap.test("DELETE /tasks/:id with invalid id", async (t) => {
  const response = await server.delete("/tasks/999");
  t.equal(response.status, 404);
  t.end();
});

// create tasks with priority and sorting to test filtering and sorting endpoints
tap.test("POST /tasks with priority and GET /tasks/priority/:level", async (t) => {
  const newTask = {
    title: "Priority Task",
    description: "Priority Task Description",
    completed: false,
    priority: "high",
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 201);
  t.equal(response.body.priority, "high");

  const listResp = await server.get("/tasks/priority/high");
  t.equal(listResp.status, 200);
  t.ok(Array.isArray(listResp.body));
  t.ok(listResp.body.some(ti => ti.title === 'Priority Task'));
  t.end();
});

tap.test("GET /tasks?sort=asc returns tasks in ascending order", async (t) => {
  // create two new tasks in sequence
  const t1 = await server.post("/tasks").send({ title: "Sort Task 1", description: "Sort 1", completed: false });
  // small pause to create different timestamps
  await new Promise((r) => setTimeout(r, 15));
  const t2 = await server.post("/tasks").send({ title: "Sort Task 2", description: "Sort 2", completed: false });

  t.equal(t1.status, 201);
  t.equal(t2.status, 201);

  const listResp = await server.get("/tasks?sort=asc");
  t.equal(listResp.status, 200);
  const titles = listResp.body.map(it => it.title);
  const idx1 = titles.indexOf("Sort Task 1");
  const idx2 = titles.indexOf("Sort Task 2");
  t.ok(idx1 >= 0 && idx2 >= 0);
  t.ok(idx1 < idx2);
  t.end();
});

tap.teardown(() => {
  process.exit(0);
});
