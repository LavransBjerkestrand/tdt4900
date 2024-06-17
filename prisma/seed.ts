import { fakerNB_NO as faker } from '@faker-js/faker'
import { PrismaClient, SUBMISSION_STATUS } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  console.log(`Seeding database...`)

  const users = await Promise.all(
    Array(3)
      .fill(0)
      .map((_, index) => {
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()

        const data = {
          id: (index + 1).toString(),
          name: `${firstName} ${lastName}`,
          email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        }

        return db.user.upsert({
          where: { id: (index + 1).toString() },
          create: data,
          update: data,
        })
      }),
  )

  const courses = await Promise.all(
    Array(5)
      .fill(0)
      .map((_, i) => {
        const data = {
          name: [
            'Store, distribuerte datamengder',
            'Introduksjon til kunstig intelligens',
            'Avanserte databasesystemer',
            'Datamodellering og databasesystemer',
            'Programvareutvikling',
          ][i],
          code: ['TDT4225', 'TDT4136', 'TDT4150', 'TDT4145', 'TDT4142'][i],
          creatorId: users[i % users.length].id,
        }

        return db.course.upsert({
          where: { id: i },
          create: data,
          update: data,
        })
      }),
  )

  const assignments = await Promise.all(
    Array(20)
      .fill(0)
      .map((_, i) => {
        const data = {
          id: i + 1,
          courseId: courses[i % courses.length].id,
          dueDate: faker.date.soon(),
          releaseDate: faker.date.anytime(),
          graderZipFile: faker.system.filePath().replace(/\..+/, '.zip'),
          name: ['Assignment', 'Oblig', 'Exercise', 'Øving', 'Lab'][Math.floor(Math.random() * 5)] + ' ' + (i + 1),
        }

        return db.assignment.upsert({
          where: { id: i + 1 },
          create: data,
          update: data,
        })
      }),
  )

  const assignmentTests = await Promise.all(
    Array(100)
      .fill(0)
      .map((_, i) => {
        const data = {
          id: i + 1,
          name: `Test ${i}`,
          maxPoints: [5, 10, 25, 50, 100][i % 5],
          assignmentId: assignments[Math.floor(Math.random() * assignments.length)].id,
        }

        return db.assignmentTest.upsert({
          where: { id: i + 1 },
          create: data,
          update: data,
          include: {
            assignmentTestConditions: true,
          },
        })
      }),
  )

  await Promise.all(
    assignmentTests.flatMap((test, i) =>
      Array(5)
        .fill(0)
        .map((_, j) => {
          const data = {
            id: i * 5 + j + 1,
            name: faker.lorem.word(),
            points: Math.floor(Math.random() * 5) + 5,
            expectedOutputRegEx: faker.string.alpha(16),
            assignmentTestId: test.id,
          }

          return db.assignmentTestCondition.upsert({
            where: { id: i * 5 + j + 1 },
            create: data,
            update: data,
          })
        }),
    ),
  )

  const studentUsers = await Promise.all(
    Array(50)
      .fill(0)
      .map((_, index) => {
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()

        const data = {
          id: (index + 1).toString(),
          name: `${firstName} ${lastName}`,
          email: faker.internet.email({ firstName, lastName }).toLowerCase(),
          courses: {
            connect: courses
              .slice(Math.floor(Math.random() * courses.length), Math.floor(Math.random() * courses.length + 1))
              .map((course) => ({ id: course.id })),
          },
        }
        return db.studentUser.upsert({
          where: { id: (index + 1).toString() },
          create: data,
          update: data,
          include: {
            courses: {
              include: {
                assignments: {
                  include: {
                    assignmentTests: {
                      include: {
                        assignmentTestConditions: true,
                      },
                    },
                  },
                },
              },
            },
          },
        })
      }),
  )

  const assignmentSubmissions = await Promise.all(
    Array(200)
      .fill(0)
      .map((_, i) => {
        const student = studentUsers[Math.floor(Math.random() * studentUsers.length)]

        const randomCourseIndex = Math.floor(Math.random() * student.courses.length)
        const randomCourse = student.courses[randomCourseIndex]

        if (!randomCourse || !randomCourse.assignments.length) {
          return Promise.resolve(null)
        }

        const randomAssignmentIndex = Math.floor(Math.random() * randomCourse.assignments.length)
        const randomAssignment = randomCourse.assignments[randomAssignmentIndex]

        const data = {
          assignmentId: randomAssignment.id,
          studentUserId: student.id,
          status: [SUBMISSION_STATUS.PENDING, SUBMISSION_STATUS.RUNNING, SUBMISSION_STATUS.FINISHED][
            Math.floor(Math.random() * 3)
          ],
          submissionZipFile: faker.system.filePath().replace(/\..+/, '.zip'),
        }

        return db.assignmentSubmission.upsert({
          where: { id: i + 1 },
          create: data,
          update: data,
          include: {
            assignment: {
              include: {
                assignmentTests: {
                  include: {
                    assignmentTestConditions: true,
                  },
                },
              },
            },
          },
        })
      }),
  )

  await Promise.all(
    assignmentSubmissions.filter(Boolean).flatMap((submission, i) =>
      Array(10)
        .fill(0)
        .map((_, j) => {
          const randomAssignmentTestIndex = Math.floor(Math.random() * submission.assignment.assignmentTests.length)
          const randomAssignmentTest = submission.assignment.assignmentTests[randomAssignmentTestIndex]

          if (!randomAssignmentTest) {
            return
          }

          const randomAssignmentTestConditionIndex = Math.floor(
            Math.random() * randomAssignmentTest.assignmentTestConditions.length,
          )
          const randomAssignmentTestCondition =
            randomAssignmentTest.assignmentTestConditions[randomAssignmentTestConditionIndex]

          if (!randomAssignmentTestCondition) {
            return
          }

          const data = {
            id: i * 10 + j + 1,
            output: faker.lorem.sentence(),
            assignmentGradingConditionId: randomAssignmentTestCondition.id,
            assignmentSubmissionId: submission.id,
          }

          return db.assignmentSubmissionTestResult.upsert({
            where: { id: i * 10 + j + 1 },
            create: data,
            update: data,
          })
        })
        .filter(Boolean),
    ),
  )

  console.log(`Database seeding complete.`)
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })
