/* Aquí irá tu código del segundo ejercicio */
import { db } from './database'

db.exec(`
  CREATE TABLE IF NOT EXISTS jobs(
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    modality TEXT NOT NULL CHECK(modality IN ('remote', 'onsite', 'hybrid')),
    level TEXT NOT NULL CHECK(level IN ('junior', 'mid', 'senior'))
  );

  CREATE TABLE IF NOT EXISTS job_technologies (
    job_id TEXT NOT NULL,
    technology TEXT NOT NULL,
    PRIMARY KEY (job_id, technology),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS job_content (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT NOT NULL,
    requirements TEXT NOT NULL,
    about TEXT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );
`)

const insertJob = db.prepare(`
  INSERT OR IGNORE INTO jobs (id, title, company, location, description, modality, level)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`)

const insertJobTechnology = db.prepare(`
  INSERT OR IGNORE INTO job_technologies (job_id, technology)
  VALUES (?, ?)
`)

const insertJobContent = db.prepare(`
  INSERT OR IGNORE INTO job_content (id, job_id, description, responsibilities, requirements, about)
  VALUES (?, ?, ?, ?, ?, ?)
`)

// Una alternativa que podemos hacer es obtener el seed del json que tenemos de jobs.json
// y luego insertarlos en la base de datos
import { readFileSync } from 'node:fs'

const jobs = JSON.parse(readFileSync('./jobs.json', 'utf-8'))

const seed = db.transaction(() => {
  for (const job of jobs) {
    insertJob.run(job.id, job.title, job.company, job.location, job.description, job.modality, job.level)
    
    for (const tech of job.technologies) {
      insertJobTechnology.run(job.id, tech)
    }

    if (job.content) {
      insertJobContent.run(job.id, job.id, job.content.description, job.content.responsibilities, job.content.requirements, job.content.about)
    }
  }
})

/* const seed = db.transaction(() => {
    insertJob.run('1', 'Senior Frontend Developer', 'Tech Corp', 'Madrid, Spain',
    'Looking for a senior frontend developer', 'hybrid', 'senior')
    insertJobTechnology.run('1', 'React')
    insertJobTechnology.run('1', 'TypeScript')
    insertJobTechnology.run('1', 'CSS')

    insertJob.run('2', 'Full Stack Developer', 'StartupX', 'Remote',
        'Join our team as a full stack developer', 'remote', 'mid')
    insertJobTechnology.run('2', 'Node.js')
    insertJobTechnology.run('2', 'React')
    insertJobTechnology.run('2', 'PostgreSQL')

    insertJob.run('3', 'Junior Backend Developer', 'FinTech Solutions', 'Barcelona, Spain',
        'Great opportunity for junior developers', 'onsite', 'junior')
    insertJobTechnology.run('3', 'Node.js')
    insertJobTechnology.run('3', 'TypeScript')
    insertJobTechnology.run('3', 'MongoDB')
}) */

seed()

console.log('Base de datos inicializada')