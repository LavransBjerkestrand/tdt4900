import { PrismaClient } from "@prisma/client";

import Docker from "dockerode";

// const db = new PrismaClient();

// const user = await db.user.create({
//   data: {
//     email: "lavrans.bjerkestrand@hotmail.com",
//     name: "Lavrans Bjerkestrand",
//   },
// });

// console.log("Created user:", user);

// const studentUser = await db.studentUser.create({
//   data: {
//     email: "lavranb@ntnu.no",
//     name: "Lavrans Bjerkestrand",
//   },
// });

// console.log("Created student user:", studentUser);

// const course1 = await db.course.create({
//   data: {
//     name: "TDT4140",
//     creatorId: user.id,
//   },
// });

// console.log("Created course:", course1);

// const assignment = await db.assignment.create({
//   data: {
//     name: "Assignment 1",
//     courseId: course1.id,
//     dueDate: new Date("2023-10-14"),
//     releaseDate: new Date("2023-10-01"),
//     graderZipFile: "data/assignment1.zip",
//   },
// });

// console.log("Created assignment:", assignment);

// const assignmentTest1 = await db.assignmentTest.create({
//   data: {
//     assignmentId: assignment.id,
//     name: "Test 1",
//     maxPoints: 50,
//     assignmentTestConditions: {
//       create: [
//         {
//           name: "Test 1 finished in less than 10 milliseconds",
//           expectedOutputRegEx: "Finished in \\d{1} ms",
//           points: 50,
//         },
//         {
//           name: "Test 1 must finish in less than 100 milliseconds",
//           expectedOutputRegEx: "Finished in \\d{2} ms",
//           points: 25,
//         },
//       ],
//     },
//   },
// });

// console.log("Created assignment test:", assignmentTest1);

// const course2 = await db.course.findFirst({
//   include: {
//     _count: {
//       select: { assignments: true, students: true },
//     },
//     assignments: {
//       include: {
//         assignmentSubmission: true,
//         assignmentTests: {
//           include: {
//             assignmentTestConditions: true,
//           },
//         },
//       },
//     },
//     creator: true,
//     students: true,
//   },
// });

// console.dir(course2, { depth: null });




// const docker = new Docker({ socketPath: "/var/run/docker.sock" });

// const buildImageStream = await docker.buildImage("data/assignment1.zip", {
//   t: "my-image",
// });
// await new Promise((resolve, reject) =>
//   docker.modem.followProgress(buildImageStream, (err, res) =>
//     err ? reject(err) : resolve(res)
//   )
// );

// const container = await docker.createContainer({
//   Image: "my-image",
//   name: "my-container",
// });

// await container.start();
