import dns from "dns"
dns.setDefaultResultOrder("ipv4first")
dns.setServers(["8.8.8.8", "8.8.4.4"])

import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"

dotenv.config()

import User from "./server/models/userModel.js"
import Mentor from "./server/models/mentorModel.js"
import Scheme from "./server/models/schemeModel.js"

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to MongoDB for seeding...".cyan)

        // Clear collections
        await User.deleteMany({})
        await Mentor.deleteMany({})
        await Scheme.deleteMany({})
        console.log("Cleared collections".yellow)

        const hashPw = (pw) => bcrypt.hash(pw, 10)

        // Create users
        const users = await User.insertMany([
            {
                name: "Rahul Sharma",
                email: "rahul@example.com",
                phone: "9876543210",
                password: await hashPw("Password@123"),
                city: "Indore",
                state: "Madhya Pradesh",
                userType: "USER",
                gender: "male",
                age: 28
            },
            {
                name: "Priya Patel",
                email: "priya@example.com",
                phone: "9876543211",
                password: await hashPw("Password@123"),
                city: "Bhopal",
                state: "Madhya Pradesh",
                userType: "USER",
                gender: "female",
                age: 25
            },
            {
                name: "Amit Verma",
                email: "amit@example.com",
                phone: "9876543212",
                password: await hashPw("Password@123"),
                city: "Jabalpur",
                state: "Madhya Pradesh",
                userType: "USER",
                gender: "male",
                age: 32
            },
            {
                name: "Sneha Joshi",
                email: "sneha@example.com",
                phone: "9876543213",
                password: await hashPw("Password@123"),
                city: "Indore",
                state: "Madhya Pradesh",
                userType: "USER",
                gender: "female",
                age: 30
            },
            {
                name: "Rajesh Gupta",
                email: "mentor1@example.com",
                phone: "9800000001",
                password: await hashPw("Password@123"),
                city: "Indore",
                state: "Madhya Pradesh",
                userType: "MENTOR",
                gender: "male",
                age: 45
            },
            {
                name: "Meena Agarwal",
                email: "mentor2@example.com",
                phone: "9800000002",
                password: await hashPw("Password@123"),
                city: "Bhopal",
                state: "Madhya Pradesh",
                userType: "MENTOR",
                gender: "female",
                age: 40
            },
            {
                name: "Admin User",
                email: "admin@example.com",
                phone: "9000000000",
                password: await hashPw("Admin@123"),
                city: "Delhi",
                state: "Delhi",
                userType: "ADMIN",
                gender: "other",
                age: 35
            }
        ])

        console.log(`Seeded ${users.length} users`.green)

        const mentorUser1 = users.find((u) => u.email === "mentor1@example.com")
        const mentorUser2 = users.find((u) => u.email === "mentor2@example.com")

        // Create mentor profiles
        await Mentor.insertMany([
            {
                user: mentorUser1._id,
                businessName: "Gupta Business Consultancy",
                address: "123 MG Road, Indore, MP",
                qualification: "MBA from IIM Indore",
                registrationNumber: "MP-MENTOR-001",
                experience: "15 years in retail and FMCG",
                expertise: ["Retail", "FMCG", "Supply Chain", "Marketing"],
                phone: "9800000001",
                email: "mentor1@example.com",
                consultationFee: 500,
                workingHours: { start: "10:00", end: "18:00" },
                availableDays: ["Monday", "Wednesday", "Friday"],
                isVerified: true,
                isActive: true
            },
            {
                user: mentorUser2._id,
                businessName: "Agarwal Digital Solutions",
                address: "45 New Market, Bhopal, MP",
                qualification: "B.Tech + 10 years startup experience",
                registrationNumber: "MP-MENTOR-002",
                experience: "10 years in tech startups and e-commerce",
                expertise: ["E-commerce", "Digital Marketing", "Startup Strategy", "Food Tech"],
                phone: "9800000002",
                email: "mentor2@example.com",
                consultationFee: 750,
                workingHours: { start: "09:00", end: "17:00" },
                availableDays: ["Tuesday", "Thursday", "Saturday"],
                isVerified: true,
                isActive: true
            }
        ])

        console.log("Seeded 2 mentor profiles".green)

        // Seed real government schemes with official URLs
        await Scheme.insertMany([
            {
                name: "PM Employment Generation Programme (PMEGP)",
                benefit: "Subsidy of 15%-35% on project cost (max Rs 50 lakh for manufacturing, Rs 20 lakh for service sector). Margin money subsidy provided by KVIC.",
                eligibility: "Any individual above 18 years; for projects above Rs 10 lakh in manufacturing, minimum VIII standard pass required. Existing units not eligible.",
                applyUrl: "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp",
                sourceUrl: "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp",
                state: "All India",
                category: "Manufacturing & Services",
                isActive: true
            },
            {
                name: "PM MUDRA Yojana - Shishu Loan",
                benefit: "Loans up to Rs 50,000 for micro enterprises at competitive interest rates. No collateral required.",
                eligibility: "Non-farm income-generating activities; micro enterprises including small manufacturing units, shopkeepers, artisans, traders.",
                applyUrl: "https://www.mudra.org.in/",
                sourceUrl: "https://www.mudra.org.in/",
                state: "All India",
                category: "Micro Enterprises",
                isActive: true
            },
            {
                name: "PM MUDRA Yojana - Kishor Loan",
                benefit: "Loans from Rs 50,001 to Rs 5 lakh for established micro enterprises. No collateral required.",
                eligibility: "Existing micro enterprises looking to expand; small businesses in manufacturing, trading, and services.",
                applyUrl: "https://www.mudra.org.in/",
                sourceUrl: "https://www.mudra.org.in/",
                state: "All India",
                category: "Micro Enterprises",
                isActive: true
            },
            {
                name: "PM MUDRA Yojana - Tarun Loan",
                benefit: "Loans from Rs 5 lakh to Rs 10 lakh for established businesses. Collateral may be required above Rs 7.5 lakh.",
                eligibility: "Well-established micro enterprises with proven track record. Businesses in manufacturing, trading, and services.",
                applyUrl: "https://www.mudra.org.in/",
                sourceUrl: "https://www.mudra.org.in/",
                state: "All India",
                category: "Small Business",
                isActive: true
            },
            {
                name: "Stand-Up India Scheme",
                benefit: "Loans between Rs 10 lakh and Rs 1 crore to set up greenfield enterprises. At least one SC/ST borrower and one woman borrower per bank branch.",
                eligibility: "SC/ST and/or women entrepreneurs above 18 years; for non-individual enterprises, 51% stake held by SC/ST or woman entrepreneur.",
                applyUrl: "https://www.standupmitra.in/",
                sourceUrl: "https://www.standupmitra.in/",
                state: "All India",
                category: "SC/ST & Women Entrepreneurs",
                isActive: true
            },
            {
                name: "PM Formalisation of Micro Food Processing Enterprises (PMFME)",
                benefit: "Credit-linked subsidy of 35% on eligible project cost (max Rs 10 lakh) for individual micro food processing units. Support for FPOs, SHGs, and cooperatives.",
                eligibility: "Existing micro food processing units; new units with existing processing activity. Annual turnover less than Rs 250 crore.",
                applyUrl: "https://pmfme.mofpi.gov.in/",
                sourceUrl: "https://pmfme.mofpi.gov.in/",
                state: "All India",
                category: "Food Processing",
                isActive: true
            },
            {
                name: "Startup India Seed Fund Scheme (SISFS)",
                benefit: "Up to Rs 20 lakh as grant for proof of concept; up to Rs 50 lakh as convertible debentures or debt for market entry and commercialization.",
                eligibility: "DPIIT-recognized startups not older than 2 years; not received more than Rs 10 lakh funding from other central/state schemes.",
                applyUrl: "https://seedfund.startupindia.gov.in/",
                sourceUrl: "https://seedfund.startupindia.gov.in/",
                state: "All India",
                category: "Startup",
                isActive: true
            },
            {
                name: "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
                benefit: "Collateral-free credit facility up to Rs 2 crore for micro and small enterprises. Guarantee coverage up to 85% for micro enterprises.",
                eligibility: "New or existing micro and small enterprises in manufacturing and service sector. Must be covered under MSME Development Act 2006.",
                applyUrl: "https://www.cgtmse.in/",
                sourceUrl: "https://www.cgtmse.in/",
                state: "All India",
                category: "MSME",
                isActive: true
            },
            {
                name: "National Small Industries Corporation (NSIC) - Raw Material Assistance",
                benefit: "Facilitates procurement of raw materials on credit basis; covers domestic and imported raw materials. Helps MSMEs with working capital.",
                eligibility: "Micro and Small Enterprises registered with NSIC. Must have satisfactory credit history.",
                applyUrl: "https://www.nsic.co.in/",
                sourceUrl: "https://www.nsic.co.in/",
                state: "All India",
                category: "MSME",
                isActive: true
            },
            {
                name: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
                benefit: "Free skill training for entrepreneurs and employees. Certification by National Skill Development Corporation. Monetary reward for trainees.",
                eligibility: "Indian nationals with Aadhaar card. No age restriction for most courses.",
                applyUrl: "https://www.pmkvyofficial.org/",
                sourceUrl: "https://www.pmkvyofficial.org/",
                state: "All India",
                category: "Skill Development",
                isActive: true
            }
        ])

        console.log("Seeded 10 government schemes".green)

        console.log("\n=== LOGIN CREDENTIALS ===".bgGreen)
        console.log("ADMIN   : admin@example.com      / Admin@123".white)
        console.log("USER 1  : rahul@example.com      / Password@123".white)
        console.log("USER 2  : priya@example.com      / Password@123".white)
        console.log("USER 3  : amit@example.com       / Password@123".white)
        console.log("USER 4  : sneha@example.com      / Password@123".white)
        console.log("MENTOR 1: mentor1@example.com    / Password@123".white)
        console.log("MENTOR 2: mentor2@example.com    / Password@123".white)
        console.log("=========================\n".bgGreen)

        process.exit(0)
    } catch (error) {
        console.error("Seed failed:".red, error.message)
        process.exit(1)
    }
}

seed()
