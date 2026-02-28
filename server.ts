import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('=== EMAIL CONFIGURATION ===');
console.log('SMTP_USER:', process.env.SMTP_USER || 'gayatrikadam1405@gmail.com');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '[SET]' : '[NOT SET]');
console.log('SMTP_HOST:', process.env.SMTP_HOST || 'smtp.gmail.com');
console.log('SMTP_PORT:', process.env.SMTP_PORT || '587');

const app = express();
const PORT = 3001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'gayatrikadam1405@gmail.com',
    pass: process.env.SMTP_PASS || 'ipbsxmrwofphxwni'
  },
  tls: {
    rejectUnauthorized: false
  }
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Jayashree@1gayatri',
  database: process.env.DB_NAME || 'tpo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const db = await pool.getConnection();
console.log('Connected to MySQL database');
db.release();

async function initializeDatabase() {
  const connection = await pool.getConnection();
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        date_of_birth DATE,
        gender VARCHAR(20),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(20),
        tenth_percentage DECIMAL(5,2),
        tenth_year INT,
        tenth_board VARCHAR(50),
        twelfth_percentage DECIMAL(5,2),
        twelfth_year INT,
        twelfth_board VARCHAR(50),
        current_cgpa DECIMAL(4,2),
        current_semester INT,
        branch VARCHAR(100),
        roll_number VARCHAR(50),
        admission_year INT,
        has_internship VARCHAR(10),
        internship_company VARCHAR(200),
        internship_duration VARCHAR(50),
        internship_description TEXT,
        has_training VARCHAR(10),
        training_details TEXT,
        password VARCHAR(255),
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Students table ready');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS tpo_admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    const [tpoExists]: any = await connection.execute('SELECT COUNT(*) as count FROM tpo_admin');
    if (tpoExists[0].count === 0) {
      await connection.execute(
        "INSERT INTO tpo_admin (email, password, name) VALUES (?, ?, ?)",
        ['tpo@college.com', 'tpo123', 'TPO Admin']
      );
      console.log('Default TPO admin created');
    }
    console.log('TPO Admin table ready');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS companies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        website VARCHAR(255),
        industry VARCHAR(100),
        location VARCHAR(100),
        logo_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Companies table ready');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS placement_drives (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_id INT,
        name VARCHAR(200) NOT NULL,
        job_role VARCHAR(100),
        ctc_range VARCHAR(50),
        location VARCHAR(100),
        drive_date DATE,
        drive_time VARCHAR(20),
        registration_deadline DATE,
        required_students INT,
        description TEXT,
        eligibility_criteria TEXT,
        applied_students INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'upcoming',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Placement Drives table ready');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        drive_id INT NOT NULL,
        status VARCHAR(50) DEFAULT 'applied',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (drive_id) REFERENCES placement_drives(id)
      )
    `);
    console.log('Applications table ready');

    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    connection.release();
  }
}

await initializeDatabase();

// Student Registration
app.post('/api/students/register', async (req, res) => {
  try {
    const data = req.body;
    
    const toNull = (val: any) => val === undefined || val === "" ? null : val;

    const values = [
      toNull(data.firstName), toNull(data.lastName), toNull(data.email), toNull(data.phone), 
      toNull(data.dateOfBirth), toNull(data.gender), toNull(data.address), toNull(data.city), 
      toNull(data.state), toNull(data.pincode), toNull(data.tenthPercentage), toNull(data.tenthYear), 
      toNull(data.tenthBoard), toNull(data.twelfthPercentage), toNull(data.twelfthYear),
      toNull(data.twelfthBoard), toNull(data.currentCGPA), toNull(data.currentSemester), 
      toNull(data.branch), toNull(data.rollNumber), toNull(data.admissionYear),
      toNull(data.hasInternship), toNull(data.internshipCompany), toNull(data.internshipDuration), 
      toNull(data.internshipDescription), toNull(data.hasTraining), toNull(data.trainingDetails), 
      data.password || 'student123', 'active'
    ];
    
    const query = `INSERT INTO students SET 
      first_name = ?, last_name = ?, email = ?, phone = ?, date_of_birth = ?, 
      gender = ?, address = ?, city = ?, state = ?, pincode = ?, 
      tenth_percentage = ?, tenth_year = ?, tenth_board = ?, twelfth_percentage = ?, 
      twelfth_year = ?, twelfth_board = ?, current_cgpa = ?, current_semester = ?, 
      branch = ?, roll_number = ?, admission_year = ?, has_internship = ?, 
      internship_company = ?, internship_duration = ?, internship_description = ?, 
      has_training = ?, training_details = ?, password = ?, status = ?`;
    
    const [result]: any = await pool.execute(query, values);
    
    try {
      const welcomeMailOptions = {
        from: 'Evolve Employ Co <gayatrikadam1405@gmail.com>',
        to: data.email,
        subject: 'Welcome to Evolve Employ Co - Registration Confirmed',
        text: `Dear ${data.firstName} ${data.lastName},\n\nWelcome to Evolve Employ Co! Your registration has been successfully completed.\n\nYour login credentials:\nEmail: ${data.email}\nPassword: ${data.password}\n\nPlease login to your dashboard to complete your profile and apply for placement drives.\n\nBest regards,\nEvolve Employ Co Team`
      };
      
      await transporter.sendMail(welcomeMailOptions);
      console.log('Welcome email sent to:', data.email);
    } catch (emailError: any) {
      console.log('Welcome email error (non-critical):', emailError.message);
    }
    
    res.json({ success: true, message: 'Registration successful', id: result.insertId });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ success: false, message: 'Email already registered' });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

// Student Login
app.post('/api/students/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows]: any = await pool.execute(
      'SELECT * FROM students WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length > 0) {
      const student = rows[0];
      delete student.password;
      res.json({ success: true, student });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// TPO Login
app.post('/api/tpo/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows]: any = await pool.execute(
      'SELECT * FROM tpo_admin WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length > 0) {
      res.json({ success: true, admin: rows[0] });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get All Students (TPO)
app.get('/api/students', async (req, res) => {
  try {
    const [rows]: any = await pool.execute('SELECT * FROM students ORDER BY created_at DESC');
    rows.forEach((s: any) => delete s.password);
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Student by ID
app.get('/api/students/:id', async (req, res) => {
  try {
    const [rows]: any = await pool.execute('SELECT * FROM students WHERE id = ?', [req.params.id]);
    if (rows.length > 0) {
      delete rows[0].password;
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Placement Drives
app.get('/api/drives', async (req, res) => {
  try {
    const [rows]: any = await pool.execute(
      'SELECT * FROM placement_drives ORDER BY drive_date ASC'
    );
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create Placement Drive (TPO)
app.post('/api/drives', async (req, res) => {
  try {
    const {
      companyId, name, jobRole, ctcRange, location, driveDate,
      driveTime, registrationDeadline, requiredStudents, description,
      eligibilityCriteria, status
    } = req.body;

    const [result]: any = await pool.execute(
      `INSERT INTO placement_drives (company_id, name, job_role, ctc_range, location,
        drive_date, drive_time, registration_deadline, required_students,
        description, eligibility_criteria, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [companyId, name, jobRole, ctcRange, location, driveDate, driveTime,
        registrationDeadline, requiredStudents, description, eligibilityCriteria, status]
    );

    res.json({ success: true, message: 'Drive created', id: result.insertId });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Apply for Drive (Student)
app.post('/api/applications', async (req, res) => {
  try {
    const { studentId, driveId } = req.body;

    const [existing]: any = await pool.execute(
      'SELECT id FROM applications WHERE student_id = ? AND drive_id = ?',
      [studentId, driveId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Already applied' });
    }

    await pool.execute(
      'INSERT INTO applications (student_id, drive_id) VALUES (?, ?)',
      [studentId, driveId]
    );

    await pool.execute(
      'UPDATE placement_drives SET applied_students = applied_students + 1 WHERE id = ?',
      [driveId]
    );

    res.json({ success: true, message: 'Application submitted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Student Applications
app.get('/api/students/:studentId/applications', async (req, res) => {
  try {
    const [rows]: any = await pool.execute(
      `SELECT a.*, pd.name as drive_name, pd.job_role, pd.ctc_range, pd.location, pd.drive_date
       FROM applications a
       JOIN placement_drives pd ON a.drive_id = pd.id
       WHERE a.student_id = ?
       ORDER BY a.applied_at DESC`,
      [req.params.studentId]
    );
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get All Applications (TPO)
app.get('/api/applications', async (req, res) => {
  try {
    const [rows]: any = await pool.execute(
      `SELECT a.*, s.first_name, s.last_name, s.email, s.phone, s.branch, s.current_cgpa,
              pd.name as drive_name, pd.job_role
       FROM applications a
       JOIN students s ON a.student_id = s.id
       JOIN placement_drives pd ON a.drive_id = pd.id
       ORDER BY a.applied_at DESC`
    );
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Companies CRUD
app.get('/api/companies', async (req, res) => {
  try {
    const [rows]: any = await pool.execute('SELECT * FROM companies ORDER BY created_at DESC');
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/companies', async (req, res) => {
  try {
    const { name, description, website, industry, location, logoUrl } = req.body;
    const [result]: any = await pool.execute(
      'INSERT INTO companies (name, description, website, industry, location, logo_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, website, industry, location, logoUrl]
    );
    res.json({ success: true, id: result.insertId });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Dashboard Stats
app.get('/api/stats', async (req, res) => {
  try {
    const [[{ totalStudents }]]: any = await pool.execute('SELECT COUNT(*) as totalStudents FROM students');
    const [[{ totalDrives }]]: any = await pool.execute('SELECT COUNT(*) as totalDrives FROM placement_drives');
    const [[{ totalApplications }]]: any = await pool.execute('SELECT COUNT(*) as totalApplications FROM applications');
    const [[{ placedStudents }]]: any = await pool.execute("SELECT COUNT(*) as placedStudents FROM applications WHERE status = 'placed'");

    res.json({ totalStudents, totalDrives, totalApplications, placedStudents });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Application Status
app.put('/api/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await pool.execute(
      'UPDATE applications SET status = ? WHERE id = ?',
      [status, id]
    );
    
    res.json({ success: true, message: 'Status updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send Email API
app.post('/api/send-email', async (req, res) => {
  console.log('=== EMAIL API CALLED ===');
  console.log('Request body:', req.body);
  
  try {
    const { to, subject, body } = req.body;
    
    if (!to || !subject || !body) {
      console.log('Missing required fields');
      return res.status(400).json({ success: false, message: 'Missing required fields: to, subject, body' });
    }
    
    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    
    // Verify transporter before sending
    try {
      await transporter.verify();
      console.log('Transporter verified successfully');
    } catch (verifyError: any) {
      console.error('Transporter verification failed:', verifyError.message);
      return res.status(500).json({ 
        success: false, 
        message: 'Email server not configured properly. Please check SMTP settings. Error: ' + verifyError.message 
      });
    }
    
    const mailOptions = {
      from: 'Evolve Employ Co <gayatrikadam1405@gmail.com>',
      to: to,
      subject: subject,
      text: body
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully! Message ID:', info.messageId);
    
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error: any) {
    console.error('=== EMAIL ERROR ===');
    console.error('Error:', error.message);
    console.error('Error code:', error.code);
    
    let errorMessage = error.message;
    if (error.message.includes('Invalid login')) {
      errorMessage = 'Invalid email credentials. Please check SMTP username and password. Make sure you are using a Gmail App Password, not your regular Gmail password.';
    } else if (error.message.includes('Too many')) {
      errorMessage = 'Too many email attempts. Please try again later.';
    } else if (error.code === 'EAUTH') {
      errorMessage = 'Authentication failed. Please verify your Gmail App Password is correct and 2-Factor Authentication is enabled on your Gmail account.';
    }
    
    res.status(500).json({ success: false, message: errorMessage });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
