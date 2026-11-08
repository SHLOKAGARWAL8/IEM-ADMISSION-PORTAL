const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

const prisma = new PrismaClient();

async function main() {
  // Programs
  const programsCsv = fs.readFileSync(path.resolve(__dirname, '../extracted/IEM_Admission_Portal_Starter_Kit/dataset/programs.csv'));
  const programs = csv.parse(programsCsv, { columns: true, trim: true });
  for (const p of programs) {
    await prisma.program.create({
      data: {
        programId: p.program_id,
        degree: p.degree,
        name: p.program_name,
        department: p.department,
        duration: p.duration,
        eligibility: p.eligibility_demo,
        feeInfo: p.fee_information,
        intake: parseInt(p.sample_intake, 10) || null,
      },
    });
  }

  // Faculty
  const facultyCsv = fs.readFileSync(path.resolve(__dirname, '../extracted/IEM_Admission_Portal_Starter_Kit/dataset/faculty.csv'));
  const faculty = csv.parse(facultyCsv, { columns: true, trim: true });
  for (const f of faculty) {
    await prisma.faculty.create({
      data: {
        name: f.name,
        department: f.department,
        photoUrl: f.photo_url || null,
        designation: f.designation || null,
      },
    });
  }

  // Events
  const eventsCsv = fs.readFileSync(path.resolve(__dirname, '../extracted/IEM_Admission_Portal_Starter_Kit/dataset/events.csv'));
  const events = csv.parse(eventsCsv, { columns: true, trim: true });
  for (const e of events) {
    await prisma.event.create({
      data: {
        title: e.title,
        description: e.description || null,
        date: new Date(e.date),
        imageUrl: e.image_url || null,
      },
    });
  }

  // Fee Structure
  const feesCsv = fs.readFileSync(path.resolve(__dirname, '../extracted/IEM_Admission_Portal_Starter_Kit/dataset/fee_structure.csv'));
  const fees = csv.parse(feesCsv, { columns: true, trim: true });
  for (const f of fees) {
    const program = await prisma.program.findUnique({ where: { programId: f.program_id } });
    if (program) {
      await prisma.feeStructure.create({
        data: {
          programId: program.id,
          description: f.description,
          amount: parseFloat(f.amount),
        },
      });
    }
  }

  console.log('Seeding complete');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
