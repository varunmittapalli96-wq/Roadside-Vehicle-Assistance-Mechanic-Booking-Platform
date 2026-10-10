"""
Generate a comprehensive Word (.docx) project report for the
Roadside Vehicle Assistance & Mechanic Booking Platform.

Includes:
  - Cover page
  - Table of Contents (auto-updating)
  - Page numbers in footer
  - All chapters: Abstract, Introduction, Literature Survey, System Analysis,
    System Design, Implementation, Testing, Screenshots, Conclusion, Bibliography
  - Tables, code snippets, diagrams (text-based), and formatting
"""

from docx import Document
from docx.shared import Pt, Inches, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.section import WD_ORIENT
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml
import os

# ── helpers ────────────────────────────────────────────────────────────────

def set_cell_shading(cell, color_hex):
    """Apply background shading to a table cell."""
    shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shading)


def add_formatted_table(doc, headers, rows, col_widths=None):
    """Add a professional-looking table."""
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.style = 'Table Grid'
    table.alignment = WD_TABLE_ALIGNMENT.CENTER

    # Header row
    for i, h in enumerate(headers):
        cell = table.rows[0].cells[i]
        cell.text = h
        for p in cell.paragraphs:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in p.runs:
                run.bold = True
                run.font.size = Pt(10)
                run.font.color.rgb = RGBColor(255, 255, 255)
        set_cell_shading(cell, "1F4E79")

    # Data rows
    for r_idx, row_data in enumerate(rows):
        for c_idx, val in enumerate(row_data):
            cell = table.rows[r_idx + 1].cells[c_idx]
            cell.text = str(val)
            for p in cell.paragraphs:
                for run in p.runs:
                    run.font.size = Pt(10)
            if r_idx % 2 == 0:
                set_cell_shading(cell, "D6E4F0")

    if col_widths:
        for i, w in enumerate(col_widths):
            for row in table.rows:
                row.cells[i].width = Inches(w)

    doc.add_paragraph()  # spacing after table


def add_code_block(doc, code_text, language=""):
    """Add a styled code block."""
    if language:
        lang_p = doc.add_paragraph()
        lang_run = lang_p.add_run(f"  {language}")
        lang_run.font.size = Pt(8)
        lang_run.font.color.rgb = RGBColor(100, 100, 100)
        lang_run.italic = True
        lang_p.space_after = Pt(2)

    for line in code_text.strip().split('\n'):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.left_indent = Inches(0.5)
        run = p.add_run(line)
        run.font.name = 'Consolas'
        run.font.size = Pt(9)
        run.font.color.rgb = RGBColor(30, 30, 30)

    doc.add_paragraph()  # spacing


def set_paragraph_font(paragraph, size=12, bold=False, color=None, name='Calibri'):
    """Set font properties for all runs in a paragraph."""
    for run in paragraph.runs:
        run.font.size = Pt(size)
        run.font.name = name
        run.bold = bold
        if color:
            run.font.color.rgb = RGBColor(*color)


def add_bullet_list(doc, items, indent_level=0):
    """Add a bulleted list."""
    for item in items:
        p = doc.add_paragraph(item, style='List Bullet')
        p.paragraph_format.left_indent = Inches(0.5 + indent_level * 0.25)
        for run in p.runs:
            run.font.size = Pt(11)


def add_numbered_list(doc, items):
    """Add a numbered list."""
    for item in items:
        p = doc.add_paragraph(item, style='List Number')
        for run in p.runs:
            run.font.size = Pt(11)


def add_body_text(doc, text):
    """Add body paragraph with standard formatting."""
    p = doc.add_paragraph(text)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = Pt(18)
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    for run in p.runs:
        run.font.size = Pt(11)
        run.font.name = 'Calibri'
    return p


# ── Page Numbers (footer) ─────────────────────────────────────────────────

def add_page_numbers(doc):
    """Add page numbers to all section footers."""
    for section in doc.sections:
        footer = section.footer
        footer.is_linked_to_previous = False
        p = footer.paragraphs[0] if footer.paragraphs else footer.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        # Page number field
        run = p.add_run()
        fldChar1 = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="begin"/>')
        run._r.append(fldChar1)
        run2 = p.add_run()
        instrText = parse_xml(f'<w:instrText {nsdecls("w")} xml:space="preserve"> PAGE </w:instrText>')
        run2._r.append(instrText)
        run3 = p.add_run()
        fldChar2 = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="separate"/>')
        run3._r.append(fldChar2)
        run4 = p.add_run("1")
        run4.font.size = Pt(10)
        run5 = p.add_run()
        fldChar3 = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="end"/>')
        run5._r.append(fldChar3)

        # Add "Page X of Y" style
        p2 = p  # reuse same paragraph
        run_of = p2.add_run(" of ")
        run_of.font.size = Pt(10)
        run6 = p2.add_run()
        fldChar4 = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="begin"/>')
        run6._r.append(fldChar4)
        run7 = p2.add_run()
        instrText2 = parse_xml(f'<w:instrText {nsdecls("w")} xml:space="preserve"> NUMPAGES </w:instrText>')
        run7._r.append(instrText2)
        run8 = p2.add_run()
        fldChar5 = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="separate"/>')
        run8._r.append(fldChar5)
        run9 = p2.add_run("1")
        run9.font.size = Pt(10)
        run10 = p2.add_run()
        fldChar6 = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="end"/>')
        run10._r.append(fldChar6)


# ── Table of Contents ──────────────────────────────────────────────────────

def add_table_of_contents(doc):
    """Insert an auto-updating Table of Contents field."""
    doc.add_heading('Table of Contents', level=1)
    p = doc.add_paragraph()
    run = p.add_run()
    fldChar1 = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="begin"/>')
    run._r.append(fldChar1)

    run2 = p.add_run()
    instrText = parse_xml(
        f'<w:instrText {nsdecls("w")} xml:space="preserve">'
        f' TOC \\o "1-3" \\h \\z \\u </w:instrText>'
    )
    run2._r.append(instrText)

    run3 = p.add_run()
    fldChar2 = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="separate"/>')
    run3._r.append(fldChar2)

    run4 = p.add_run('[Right-click → Update Field to refresh Table of Contents]')
    run4.font.size = Pt(10)
    run4.font.color.rgb = RGBColor(128, 128, 128)
    run4.italic = True

    run5 = p.add_run()
    fldChar3 = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="end"/>')
    run5._r.append(fldChar3)

    doc.add_page_break()


# ══════════════════════════════════════════════════════════════════════════
# MAIN REPORT GENERATION
# ══════════════════════════════════════════════════════════════════════════

def generate_report():
    doc = Document()

    # ── Default font ──
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Calibri'
    font.size = Pt(11)

    # Heading styles
    for i in range(1, 5):
        hs = doc.styles[f'Heading {i}']
        hs.font.name = 'Calibri'
        hs.font.color.rgb = RGBColor(31, 78, 121)

    # ── Section / margin setup ──
    section = doc.sections[0]
    section.top_margin = Cm(2.54)
    section.bottom_margin = Cm(2.54)
    section.left_margin = Cm(3.17)
    section.right_margin = Cm(2.54)

    # ══════════════════════════════════════════════════════════════════════
    # COVER PAGE
    # ══════════════════════════════════════════════════════════════════════

    # Spacer
    for _ in range(4):
        doc.add_paragraph()

    # Title
    title_p = doc.add_paragraph()
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_run = title_p.add_run('ROADSIDE VEHICLE ASSISTANCE\n& MECHANIC BOOKING PLATFORM')
    title_run.font.size = Pt(28)
    title_run.bold = True
    title_run.font.color.rgb = RGBColor(31, 78, 121)
    title_run.font.name = 'Calibri'

    # Subtitle
    sub_p = doc.add_paragraph()
    sub_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub_run = sub_p.add_run('A Comprehensive Project Report')
    sub_run.font.size = Pt(16)
    sub_run.font.color.rgb = RGBColor(89, 89, 89)
    sub_run.italic = True

    doc.add_paragraph()

    # Horizontal line
    hr_p = doc.add_paragraph()
    hr_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    hr_run = hr_p.add_run('━' * 50)
    hr_run.font.color.rgb = RGBColor(31, 78, 121)
    hr_run.font.size = Pt(14)

    doc.add_paragraph()

    # Project details
    details = [
        ('Project Name', 'Roadside Vehicle Assistance & Mechanic Booking Platform'),
        ('Project Code', 'Roadside AAA'),
        ('Organization', 'Unified Mentor'),
        ('Developer', 'Varun Mittapalli'),
        ('Technology Stack', 'Next.js 14, React, Node.js, Express.js, MongoDB'),
        ('Version', '1.0 (Phase 1)'),
        ('Date', 'July 2026'),
    ]

    for label, value in details:
        dp = doc.add_paragraph()
        dp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        label_run = dp.add_run(f'{label}: ')
        label_run.bold = True
        label_run.font.size = Pt(12)
        label_run.font.color.rgb = RGBColor(31, 78, 121)
        val_run = dp.add_run(value)
        val_run.font.size = Pt(12)

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════
    # TABLE OF CONTENTS
    # ══════════════════════════════════════════════════════════════════════

    add_table_of_contents(doc)

    # ══════════════════════════════════════════════════════════════════════
    # LIST OF FIGURES
    # ══════════════════════════════════════════════════════════════════════

    doc.add_heading('List of Figures', level=1)
    figures = [
        ('Figure 1', 'System Architecture Diagram'),
        ('Figure 2', 'Entity-Relationship (ER) Diagram'),
        ('Figure 3', 'Use Case Diagram'),
        ('Figure 4', 'Service Request Status Flow Diagram'),
        ('Figure 5', 'Data Flow Diagram (Level 0)'),
        ('Figure 6', 'Data Flow Diagram (Level 1)'),
        ('Figure 7', 'Frontend Component Hierarchy'),
        ('Figure 8', 'Authentication Flow Sequence Diagram'),
        ('Figure 9', 'Deployment Architecture'),
    ]
    add_formatted_table(doc, ['Figure No.', 'Description'], figures, [1.5, 4.5])
    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════
    # LIST OF TABLES
    # ══════════════════════════════════════════════════════════════════════

    doc.add_heading('List of Tables', level=1)
    tables_list = [
        ('Table 1', 'Technology Stack Comparison'),
        ('Table 2', 'Functional Requirements — Vehicle Owner'),
        ('Table 3', 'Functional Requirements — Mechanic / Towing Partner'),
        ('Table 4', 'Functional Requirements — Admin'),
        ('Table 5', 'Non-Functional Requirements'),
        ('Table 6', 'API Endpoints Summary'),
        ('Table 7', 'Database Schema — User Collection'),
        ('Table 8', 'Database Schema — Vehicle Collection'),
        ('Table 9', 'Database Schema — ServiceRequest Collection'),
        ('Table 10', 'Frontend Route Structure'),
        ('Table 11', 'Backend Dependencies'),
        ('Table 12', 'Frontend Dependencies'),
        ('Table 13', 'Test Cases — Authentication Module'),
        ('Table 14', 'Test Cases — Service Request Module'),
        ('Table 15', 'Test Cases — Admin Module'),
        ('Table 16', 'Demo Accounts'),
        ('Table 17', 'KPI Metrics'),
    ]
    add_formatted_table(doc, ['Table No.', 'Description'], tables_list, [1.5, 4.5])
    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════
    # CHAPTER 1: ABSTRACT
    # ══════════════════════════════════════════════════════════════════════

    doc.add_heading('Chapter 1: Abstract', level=1)

    add_body_text(doc,
        "The Roadside Vehicle Assistance & Mechanic Booking Platform (Roadside AAA) is a full-stack "
        "web application that provides real-time, on-demand roadside assistance by connecting vehicle "
        "owners with verified nearby mechanics and towing service providers. The platform addresses "
        "critical challenges faced by vehicle owners during breakdowns, including difficulty finding "
        "reliable mechanics, unclear pricing structures, delayed support, lack of real-time tracking, "
        "and over-dependence on manual phone calls."
    )

    add_body_text(doc,
        "Built using a modern MERN-like stack comprising Next.js 14 with TypeScript on the frontend "
        "and Node.js with Express.js on the backend, the application leverages MongoDB with GeoJSON "
        "support for geospatial queries to locate nearby service providers. The system implements "
        "JWT-based authentication, role-based access control (RBAC) for three distinct user roles "
        "(vehicle owner, mechanic/towing partner, and administrator), and a comprehensive service "
        "request lifecycle management system with real-time status tracking."
    )

    add_body_text(doc,
        "Key features include vehicle management, service request creation with six service types "
        "(breakdown repair, towing, battery jump-start, flat tire repair, fuel delivery, and lockout "
        "assistance), nearby mechanic discovery using the Haversine formula for distance calculation, "
        "estimated time of arrival (ETA) computation, transparent pricing, live service tracking via "
        "polling, service history with ratings and feedback, mechanic earnings dashboard, and a "
        "comprehensive admin panel with KPI monitoring, partner verification, and dispute resolution."
    )

    add_body_text(doc,
        "The application is designed to be responsive across desktop and mobile devices, employing "
        "Tailwind CSS for utility-first styling. The platform demonstrates a production-ready "
        "architecture suitable for deployment on cloud services like Vercel (frontend), Render/Railway "
        "(backend), and MongoDB Atlas (database)."
    )

    p = add_body_text(doc,
        "Keywords: Roadside Assistance, Mechanic Booking, MERN Stack, Geospatial Queries, "
        "Real-time Tracking, JWT Authentication, Next.js, MongoDB, REST API"
    )
    for run in p.runs:
        run.italic = True
        run.bold = True

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════
    # CHAPTER 2: INTRODUCTION
    # ══════════════════════════════════════════════════════════════════════

    doc.add_heading('Chapter 2: Introduction', level=1)

    doc.add_heading('2.1 Overview', level=2)
    add_body_text(doc,
        "Vehicle breakdowns are unpredictable events that can leave drivers stranded, stressed, and "
        "vulnerable, especially on highways or in unfamiliar areas. Traditional methods of finding "
        "roadside assistance typically involve manual phone calls, unreliable word-of-mouth referrals, "
        "and uncertain wait times. These pain points create a significant market opportunity for a "
        "technology-driven solution."
    )
    add_body_text(doc,
        "The Roadside Vehicle Assistance & Mechanic Booking Platform (Roadside AAA) is designed to "
        "bridge this gap by providing a centralized, digital platform that connects vehicle owners "
        "with verified mechanics and towing service providers in real time. The platform leverages "
        "modern web technologies and geospatial capabilities to deliver fast, transparent, and "
        "reliable roadside assistance."
    )

    doc.add_heading('2.2 Problem Statement', level=2)
    add_body_text(doc,
        "Vehicle breakdowns cause significant stress and delay due to the following challenges:"
    )
    add_bullet_list(doc, [
        "Difficulty finding reliable and trustworthy mechanics in the vicinity",
        "Unclear and non-transparent pricing for roadside services",
        "Delayed support due to manual communication channels",
        "Lack of real-time tracking of service provider arrival",
        "No centralized platform for service history and accountability",
        "Over-dependence on manual phone calls and referrals",
        "No mechanism for rating and feedback on services received",
    ])

    doc.add_heading('2.3 Objectives', level=2)
    doc.add_heading('2.3.1 Primary Objectives', level=3)
    add_bullet_list(doc, [
        "Provide fast and efficient roadside assistance during vehicle breakdowns",
        "Connect vehicle owners with verified nearby mechanics and towing services",
        "Offer transparent pricing and detailed service information",
        "Reduce vehicle downtime and user stress through technology",
        "Enable real-time tracking of service request status",
    ])

    doc.add_heading('2.3.2 Secondary Objectives', level=3)
    add_bullet_list(doc, [
        "Improve trust in local automotive services through ratings and reviews",
        "Enable comprehensive service history and accountability",
        "Support scalable expansion across cities and regions",
        "Provide mechanics with a digital platform for job management and earnings tracking",
        "Give administrators tools for platform monitoring and quality control",
    ])

    doc.add_heading('2.4 Scope of the Project', level=2)
    doc.add_heading('2.4.1 In Scope (Phase 1)', level=3)
    add_bullet_list(doc, [
        "Responsive web platform (desktop and mobile)",
        "Real-time mechanic discovery and booking via geospatial queries",
        "Six service types: breakdown repair, towing, battery jump-start, flat tire repair, fuel delivery, lockout assistance",
        "Service tracking with status updates (pending → accepted → en route → arrived → in progress → completed)",
        "User, mechanic, and admin dashboards with role-based access",
        "JWT-based authentication and authorization",
        "Rating and feedback system",
        "Admin partner verification workflow",
    ])

    doc.add_heading('2.4.2 Out of Scope (Phase 1)', level=3)
    add_bullet_list(doc, [
        "Native mobile applications (iOS/Android)",
        "Vehicle insurance claim processing",
        "Spare parts inventory management",
        "Online payment gateway integration",
        "Push notifications (WebSocket/SSE)",
    ])

    doc.add_heading('2.5 Project Significance', level=2)
    add_body_text(doc,
        "This project is significant as it demonstrates the practical application of full-stack web "
        "development skills including frontend development with Next.js and React, backend API "
        "design with Express.js, database design with MongoDB, authentication and authorization, "
        "geospatial computing, and modern UI/UX design. It addresses a real-world problem that "
        "impacts millions of vehicle owners and creates value for both service consumers and providers."
    )

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════
    # CHAPTER 3: LITERATURE SURVEY
    # ══════════════════════════════════════════════════════════════════════

    doc.add_heading('Chapter 3: Literature Survey', level=1)

    doc.add_heading('3.1 Existing Systems', level=2)
    add_body_text(doc,
        "Several existing platforms provide roadside assistance services. A comparative analysis "
        "of these systems provides context for the design decisions made in this project."
    )

    doc.add_heading('3.1.1 AAA (American Automobile Association)', level=3)
    add_body_text(doc,
        "AAA is a well-established roadside assistance provider in the United States offering "
        "membership-based services including towing, battery service, flat tire change, fuel delivery, "
        "and locksmith service. While comprehensive, AAA operates on a membership model with annual "
        "fees and is geographically limited to the US and Canada. The platform lacks real-time "
        "transparent pricing and relies heavily on dispatched service providers."
    )

    doc.add_heading('3.1.2 Mechanic On-Demand Apps', level=3)
    add_body_text(doc,
        "Various mobile-first platforms like YourMechanic and Wrench have emerged to provide "
        "on-demand mechanic services. These platforms focus on scheduled repairs rather than "
        "emergency roadside assistance and typically require advance booking. They demonstrate "
        "the viability of a marketplace model for automotive services."
    )

    doc.add_heading('3.1.3 Ride-Hailing Model Inspiration', level=3)
    add_body_text(doc,
        "Platforms like Uber and Ola have pioneered the real-time geolocation-based service "
        "matching model. The key concepts of nearby provider discovery, ETA estimation, real-time "
        "tracking, and post-service rating systems have been adapted for the roadside assistance "
        "domain in this project."
    )

    doc.add_heading('3.2 Technology Review', level=2)

    doc.add_heading('3.2.1 Next.js and React Ecosystem', level=3)
    add_body_text(doc,
        "Next.js 14, built on top of React, provides a robust framework for building modern web "
        "applications with features like the App Router for file-system based routing, server-side "
        "rendering (SSR), static site generation (SSG), and API routes. The App Router architecture "
        "enables colocation of layouts, loading states, and error boundaries, making it ideal for "
        "building complex dashboard interfaces."
    )

    doc.add_heading('3.2.2 Node.js and Express.js', level=3)
    add_body_text(doc,
        "Node.js provides a non-blocking, event-driven JavaScript runtime ideal for building "
        "scalable network applications. Express.js, a minimal and flexible web framework for "
        "Node.js, enables rapid API development with middleware support, routing, and error handling. "
        "The combination is well-suited for building RESTful APIs with JSON data exchange."
    )

    doc.add_heading('3.2.3 MongoDB and Geospatial Capabilities', level=3)
    add_body_text(doc,
        "MongoDB is a document-oriented NoSQL database that provides flexibility in schema design "
        "and native support for GeoJSON data types and 2dsphere indexes. These geospatial capabilities "
        "are critical for the nearby mechanic discovery feature, enabling efficient location-based "
        "queries. Mongoose ODM provides schema validation and middleware hooks for data integrity."
    )

    doc.add_heading('3.2.4 JWT Authentication', level=3)
    add_body_text(doc,
        "JSON Web Tokens (JWT) provide a stateless, self-contained method for securely transmitting "
        "information between parties as a JSON object. JWTs are digitally signed and can carry "
        "claims (user ID, role) that enable role-based access control without maintaining server-side "
        "sessions, making the architecture horizontally scalable."
    )

    doc.add_heading('3.3 Research Gap', level=2)
    add_body_text(doc,
        "The literature survey reveals that while individual components of roadside assistance "
        "platforms exist, there is a gap in providing an integrated, open-source, full-stack "
        "solution that combines real-time geospatial mechanic discovery, transparent pricing, "
        "service lifecycle tracking, multi-role dashboards, and admin oversight within a single "
        "platform. This project aims to fill that gap."
    )

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════
    # CHAPTER 4: SYSTEM ANALYSIS
    # ══════════════════════════════════════════════════════════════════════

    doc.add_heading('Chapter 4: System Analysis', level=1)

    doc.add_heading('4.1 Requirement Analysis', level=2)

    doc.add_heading('4.1.1 Functional Requirements — Vehicle Owner', level=3)
    add_formatted_table(doc,
        ['S.No.', 'Feature', 'Description', 'Status'],
        [
            ['1', 'Registration & Login', 'Users can register with name, email, phone, and password. Login via email/password returns a JWT token.', 'Implemented'],
            ['2', 'Vehicle Management', 'Add, view, edit, and delete vehicles with make, model, year, license plate, color, and fuel type.', 'Implemented'],
            ['3', 'Request Assistance', 'Create service requests by selecting vehicle, service type, providing location, and optionally choosing a mechanic.', 'Implemented'],
            ['4', 'Nearby Mechanic Discovery', 'View verified mechanics within 50 km radius with distance, rating, ETA, and pricing information.', 'Implemented'],
            ['5', 'Real-time Tracking', 'Track service request status updates via polling (5–15 second intervals).', 'Implemented'],
            ['6', 'Service History', 'View past and active service requests with full details and status history.', 'Implemented'],
            ['7', 'Rating & Feedback', 'Rate completed services (1–5 stars) and provide written feedback.', 'Implemented'],
        ],
        [0.5, 1.5, 3.0, 1.0]
    )

    doc.add_heading('4.1.2 Functional Requirements — Mechanic / Towing Partner', level=3)
    add_formatted_table(doc,
        ['S.No.', 'Feature', 'Description', 'Status'],
        [
            ['1', 'Partner Registration', 'Register as mechanic with business name and license number. Requires admin verification.', 'Implemented'],
            ['2', 'Profile Management', 'Update business name, bio, experience, services offered, and pricing for each service type.', 'Implemented'],
            ['3', 'View Pending Requests', 'Browse all pending service requests from users that are awaiting mechanic acceptance.', 'Implemented'],
            ['4', 'Accept Requests', 'Accept pending requests to begin service. Calculates price based on mechanic pricing.', 'Implemented'],
            ['5', 'Status Updates', 'Update job status through lifecycle: en route → arrived → in progress → completed.', 'Implemented'],
            ['6', 'Earnings Dashboard', 'Track total earnings, total completed jobs, and view recent job history.', 'Implemented'],
            ['7', 'Location Update', 'Update current location coordinates for accurate distance calculations.', 'Implemented'],
        ],
        [0.5, 1.5, 3.0, 1.0]
    )

    doc.add_heading('4.1.3 Functional Requirements — Admin', level=3)
    add_formatted_table(doc,
        ['S.No.', 'Feature', 'Description', 'Status'],
        [
            ['1', 'KPI Dashboard', 'View total users, mechanics, pending applications, active/completed requests, avg rating, acceptance rate.', 'Implemented'],
            ['2', 'Partner Verification', 'Review, verify, or reject mechanic/towing partner applications.', 'Implemented'],
            ['3', 'User Management', 'View all registered vehicle owners.', 'Implemented'],
            ['4', 'Request Monitoring', 'View all service requests across the platform with full details.', 'Implemented'],
            ['5', 'Dispute Resolution', 'Resolve or cancel disputed service requests with admin notes.', 'Implemented'],
        ],
        [0.5, 1.5, 3.0, 1.0]
    )

    doc.add_heading('4.1.4 Non-Functional Requirements', level=3)
    add_formatted_table(doc,
        ['Requirement', 'Implementation Details'],
        [
            ['Performance', 'Polling-based updates at 5–15 second intervals; geospatial queries with 2dsphere indexes; Haversine formula for distance calculation'],
            ['Security', 'JWT-based authentication with 7-day token expiry; bcrypt password hashing with 12 salt rounds; role-based authorization middleware'],
            ['Usability', 'Emergency-friendly UI with large call-to-action buttons; mobile-responsive design; intuitive dashboard navigation'],
            ['Scalability', 'Stateless REST API architecture; MongoDB compound and geospatial indexes; modular codebase structure'],
            ['Reliability', 'Error handling middleware; input validation; status history audit trail for all service requests'],
        ],
        [2.0, 4.0]
    )

    doc.add_heading('4.2 Feasibility Study', level=2)

    doc.add_heading('4.2.1 Technical Feasibility', level=3)
    add_body_text(doc,
        "The project is technically feasible as it uses well-established, production-ready "
        "technologies. Next.js 14 and React provide a mature frontend framework, Express.js is "
        "battle-tested for API development, and MongoDB Atlas offers managed cloud database services. "
        "All libraries used are actively maintained with large communities and comprehensive documentation."
    )

    doc.add_heading('4.2.2 Operational Feasibility', level=3)
    add_body_text(doc,
        "The platform is designed to be intuitive for all user roles. Vehicle owners can request "
        "assistance with minimal steps, mechanics receive clear job information, and administrators "
        "have comprehensive dashboards. The responsive design ensures accessibility across devices."
    )

    doc.add_heading('4.2.3 Economic Feasibility', level=3)
    add_body_text(doc,
        "The project uses entirely open-source technologies, eliminating licensing costs. "
        "Deployment costs are minimal with free tiers available on Vercel (frontend), Render "
        "(backend), and MongoDB Atlas (database). The platform can generate revenue through "
        "commission-based models on service bookings."
    )

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════
    # CHAPTER 5: SYSTEM DESIGN
    # ══════════════════════════════════════════════════════════════════════

    doc.add_heading('Chapter 5: System Design', level=1)

    doc.add_heading('5.1 System Architecture', level=2)
    add_body_text(doc,
        "The application follows a client-server architecture with a clear separation between "
        "the frontend (presentation layer), backend (business logic layer), and database (data "
        "persistence layer). Communication between the frontend and backend occurs via RESTful "
        "API calls using JSON as the data interchange format."
    )

    add_body_text(doc, "Figure 1: System Architecture Diagram")
    add_code_block(doc, """
┌─────────────────────────┐       REST/JSON       ┌─────────────────────────┐
│    Next.js 14 App       │ ◄──────────────────►  │    Express.js API       │
│    (Frontend)           │      JWT Auth          │    (Backend)            │
│    Port: 3000           │                        │    Port: 5000           │
│                         │                        │                         │
│  ┌─────────────────┐    │                        │  ┌─────────────────┐    │
│  │ React Components│    │                        │  │ Route Handlers  │    │
│  │ Auth Context    │    │                        │  │ Auth Middleware  │    │
│  │ API Client      │    │                        │  │ Mongoose Models │    │
│  │ Tailwind CSS    │    │                        │  │ Utility Helpers │    │
│  └─────────────────┘    │                        │  └────────┬────────┘    │
└─────────────────────────┘                        └───────────┼────────────┘
                                                               │
                                                   ┌───────────▼────────────┐
                                                   │      MongoDB           │
                                                   │  (GeoJSON 2dsphere)    │
                                                   │                        │
                                                   │  Collections:          │
                                                   │  • Users               │
                                                   │  • Vehicles            │
                                                   │  • ServiceRequests     │
                                                   └────────────────────────┘
""")

    doc.add_heading('5.2 Database Design', level=2)

    doc.add_heading('5.2.1 Entity-Relationship Diagram', level=3)
    add_body_text(doc, "Figure 2: Entity-Relationship (ER) Diagram")
    add_code_block(doc, """
    ┌──────────────┐         1:N         ┌──────────────┐
    │    User      │─────────────────────│   Vehicle    │
    │  (owner)     │                     │              │
    └──────┬───────┘                     └──────┬───────┘
           │                                    │
           │ 1:N                                │ 1:1
           │                                    │
    ┌──────▼───────────────────────────────────▼───────┐
    │              ServiceRequest                       │
    │  userId ──► User (vehicle owner)                  │
    │  vehicleId ──► Vehicle                            │
    │  mechanicId ──► User (mechanic)                   │
    └──────────────────────────────────────────────────┘
           │
           │ N:1
           │
    ┌──────▼───────┐
    │    User      │
    │  (mechanic)  │
    └──────────────┘
""")

    doc.add_heading('5.2.2 User Collection Schema', level=3)
    add_formatted_table(doc,
        ['Field', 'Type', 'Constraints', 'Description'],
        [
            ['name', 'String', 'Required, Trimmed', 'Full name of the user'],
            ['email', 'String', 'Required, Unique, Lowercase', 'Email address (login identifier)'],
            ['phone', 'String', 'Required', 'Contact phone number'],
            ['password', 'String', 'Required, Min 6 chars', 'Hashed password (bcrypt, 12 rounds)'],
            ['role', 'String', 'Enum: user/mechanic/admin', 'User role for access control'],
            ['isVerified', 'Boolean', 'Default: false', 'Verification status (admin-approved for mechanics)'],
            ['profile.businessName', 'String', 'Optional', 'Mechanic business name'],
            ['profile.licenseNumber', 'String', 'Optional', 'Mechanic license number'],
            ['profile.experience', 'Number', 'Optional', 'Years of experience'],
            ['profile.services', '[String]', 'Optional', 'Services offered by mechanic'],
            ['profile.pricing.*', 'Number', 'Defaults set', 'Per-service pricing (6 service types)'],
            ['profile.rating', 'Number', 'Default: 0', 'Average rating from users'],
            ['profile.totalRatings', 'Number', 'Default: 0', 'Count of ratings received'],
            ['profile.totalJobs', 'Number', 'Default: 0', 'Total completed jobs'],
            ['profile.earnings', 'Number', 'Default: 0', 'Total earnings accumulated'],
            ['location.type', 'String', 'Enum: Point', 'GeoJSON type'],
            ['location.coordinates', '[Number]', 'Default: [77.59, 12.97]', 'Longitude, Latitude pair'],
            ['location.address', 'String', 'Optional', 'Human-readable address'],
            ['isAvailable', 'Boolean', 'Default: true', 'Mechanic availability status'],
        ],
        [1.8, 0.8, 1.6, 1.8]
    )

    doc.add_heading('5.2.3 Vehicle Collection Schema', level=3)
    add_formatted_table(doc,
        ['Field', 'Type', 'Constraints', 'Description'],
        [
            ['userId', 'ObjectId', 'Required, Ref: User', 'Owner of the vehicle'],
            ['make', 'String', 'Required', 'Vehicle manufacturer (e.g., Maruti Suzuki)'],
            ['model', 'String', 'Required', 'Vehicle model (e.g., Swift)'],
            ['year', 'Number', 'Required', 'Manufacturing year'],
            ['licensePlate', 'String', 'Required', 'Registration number'],
            ['color', 'String', 'Optional', 'Vehicle color'],
            ['fuelType', 'String', 'Enum: petrol/diesel/electric/hybrid/cng', 'Fuel type'],
        ],
        [1.5, 1.0, 1.8, 1.7]
    )

    doc.add_heading('5.2.4 ServiceRequest Collection Schema', level=3)
    add_formatted_table(doc,
        ['Field', 'Type', 'Constraints', 'Description'],
        [
            ['userId', 'ObjectId', 'Required, Ref: User', 'User who created the request'],
            ['vehicleId', 'ObjectId', 'Required, Ref: Vehicle', 'Vehicle needing service'],
            ['mechanicId', 'ObjectId', 'Optional, Ref: User', 'Assigned mechanic'],
            ['serviceType', 'String', 'Required, Enum (6 types)', 'Type of service requested'],
            ['description', 'String', 'Default: empty', 'Additional description of the issue'],
            ['location.coordinates', '[Number]', 'Required', 'Breakdown location (GeoJSON)'],
            ['location.address', 'String', 'Required', 'Breakdown address'],
            ['status', 'String', 'Enum (7 states)', 'Current request status'],
            ['estimatedPrice', 'Number', 'Required', 'Estimated service cost'],
            ['finalPrice', 'Number', 'Optional', 'Final price after completion'],
            ['estimatedArrivalMinutes', 'Number', 'Optional', 'ETA in minutes'],
            ['rating', 'Number', 'Min: 1, Max: 5', 'User rating after service'],
            ['feedback', 'String', 'Optional', 'User feedback text'],
            ['statusHistory', '[Object]', 'Array', 'Audit trail of status changes'],
        ],
        [1.8, 0.8, 1.6, 1.8]
    )

    doc.add_heading('5.2.5 Database Indexes', level=3)
    add_formatted_table(doc,
        ['Collection', 'Index', 'Type', 'Purpose'],
        [
            ['User', 'location', '2dsphere', 'Geospatial queries for nearby mechanics'],
            ['User', 'role + isVerified', 'Compound', 'Efficient mechanic filtering'],
            ['ServiceRequest', 'location', '2dsphere', 'Geospatial queries on breakdown locations'],
            ['ServiceRequest', 'status + createdAt', 'Compound', 'Admin dashboard queries'],
        ],
        [1.5, 1.5, 1.0, 2.0]
    )

    doc.add_heading('5.3 Use Case Diagram', level=2)
    add_body_text(doc, "Figure 3: Use Case Diagram")
    add_code_block(doc, """
    ┌────────────────────────────────────────────────────────────────┐
    │                     SYSTEM BOUNDARY                           │
    │                                                                │
    │  ┌─────────────┐                        ┌──────────────┐      │
    │  │ Register    │◄───── Vehicle ─────►   │ Login        │      │
    │  │ Account     │       Owner            │              │      │
    │  └─────────────┘                        └──────────────┘      │
    │  ┌─────────────┐                        ┌──────────────┐      │
    │  │ Manage      │                        │ Request      │      │
    │  │ Vehicles    │                        │ Assistance   │      │
    │  └─────────────┘                        └──────────────┘      │
    │  ┌─────────────┐                        ┌──────────────┐      │
    │  │ View Nearby │                        │ Track Service│      │
    │  │ Mechanics   │                        │              │      │
    │  └─────────────┘                        └──────────────┘      │
    │  ┌─────────────┐                        ┌──────────────┐      │
    │  │ Rate &      │                        │ View History │      │
    │  │ Review      │                        │              │      │
    │  └─────────────┘                        └──────────────┘      │
    │                                                                │
    │  ┌─────────────┐                        ┌──────────────┐      │
    │  │ Accept      │◄───── Mechanic ─────► │ Update       │      │
    │  │ Requests    │                        │ Job Status   │      │
    │  └─────────────┘                        └──────────────┘      │
    │  ┌─────────────┐                        ┌──────────────┐      │
    │  │ Manage      │                        │ View         │      │
    │  │ Profile     │                        │ Earnings     │      │
    │  └─────────────┘                        └──────────────┘      │
    │                                                                │
    │  ┌─────────────┐                        ┌──────────────┐      │
    │  │ Verify      │◄───── Admin ─────────►│ Monitor      │      │
    │  │ Partners    │                        │ Requests     │      │
    │  └─────────────┘                        └──────────────┘      │
    │  ┌─────────────┐                        ┌──────────────┐      │
    │  │ Manage      │                        │ View KPI     │      │
    │  │ Users       │                        │ Dashboard    │      │
    │  └─────────────┘                        └──────────────┘      │
    └────────────────────────────────────────────────────────────────┘
""")

    doc.add_heading('5.4 Service Request Status Flow', level=2)
    add_body_text(doc, "Figure 4: Service Request Status Flow Diagram")
    add_code_block(doc, """
    ┌──────────┐     User creates      ┌──────────┐     Mechanic accepts
    │          │     request            │          │     request
    │  START   │────────────────────►  │ PENDING  │──────────────────────┐
    │          │                        │          │                      │
    └──────────┘                        └────┬─────┘                      │
                                             │                            │
                                     User cancels                         │
                                             │                            │
                                     ┌───────▼──────┐              ┌─────▼────────┐
                                     │  CANCELLED   │              │  ACCEPTED    │
                                     └──────────────┘              └─────┬────────┘
                                                                         │
                                                                Mechanic en route
                                                                         │
                                                                   ┌─────▼────────┐
                                                                   │  EN ROUTE    │
                                                                   └─────┬────────┘
                                                                         │
                                                                Mechanic arrives
                                                                         │
                                                                   ┌─────▼────────┐
                                                                   │  ARRIVED     │
                                                                   └─────┬────────┘
                                                                         │
                                                                 Work begins
                                                                         │
                                                                   ┌─────▼────────┐
                                                                   │ IN PROGRESS  │
                                                                   └─────┬────────┘
                                                                         │
                                                                  Work completed
                                                                         │
                                                                   ┌─────▼────────┐
                                                                   │  COMPLETED   │
                                                                   └──────────────┘
""")

    doc.add_heading('5.5 Data Flow Diagrams', level=2)

    doc.add_heading('5.5.1 Level 0 (Context Diagram)', level=3)
    add_body_text(doc, "Figure 5: Data Flow Diagram — Level 0")
    add_code_block(doc, """
    ┌──────────────┐                                    ┌──────────────┐
    │   Vehicle    │ ── Registration/Login ──────────► │              │
    │   Owner      │ ── Service Request ─────────────► │              │
    │              │ ◄── Nearby Mechanics ──────────── │              │
    │              │ ◄── Status Updates ────────────── │  Roadside    │
    └──────────────┘                                    │  AAA         │
                                                        │  Platform    │
    ┌──────────────┐                                    │              │
    │   Mechanic   │ ── Registration ────────────────► │              │
    │              │ ◄── Job Requests ─────────────── │              │
    │              │ ── Status Updates ──────────────► │              │
    │              │ ◄── Earnings Data ────────────── │              │
    └──────────────┘                                    │              │
                                                        │              │
    ┌──────────────┐                                    │              │
    │   Admin      │ ◄── KPI Dashboard ────────────── │              │
    │              │ ── Verify/Reject ──────────────► │              │
    │              │ ── Resolve Disputes ───────────► │              │
    └──────────────┘                                    └──────────────┘
""")

    doc.add_heading('5.5.2 Level 1 (Detailed DFD)', level=3)
    add_body_text(doc, "Figure 6: Data Flow Diagram — Level 1")
    add_code_block(doc, """
    ┌──────────────┐       ┌─────────────────┐       ┌──────────────┐
    │ User Input   │──────►│ 1.0 Auth Module │──────►│ User DB      │
    │ (credentials)│       │ (Register/Login)│       │              │
    └──────────────┘       └────────┬────────┘       └──────────────┘
                                    │ JWT Token
                           ┌────────▼────────┐       ┌──────────────┐
                           │ 2.0 Vehicle     │──────►│ Vehicle DB   │
                           │ Management      │       │              │
                           └────────┬────────┘       └──────────────┘
                                    │
                           ┌────────▼────────┐       ┌──────────────┐
                           │ 3.0 Service     │──────►│ Request DB   │
                           │ Request Engine  │       │              │
                           └────────┬────────┘       └──────────────┘
                                    │
                           ┌────────▼────────┐
                           │ 4.0 Geospatial  │
                           │ Query Engine    │
                           │ (Haversine)     │
                           └────────┬────────┘
                                    │
                           ┌────────▼────────┐
                           │ 5.0 Admin       │
                           │ Dashboard       │
                           │ (KPIs, Verify)  │
                           └─────────────────┘
""")

    doc.add_heading('5.6 API Design', level=2)
    add_body_text(doc, "The backend exposes a RESTful API with the following endpoints:")
    add_formatted_table(doc,
        ['Method', 'Endpoint', 'Auth', 'Description'],
        [
            ['POST', '/api/auth/register', 'Public', 'Register user or mechanic account'],
            ['POST', '/api/auth/login', 'Public', 'Login and receive JWT token'],
            ['GET', '/api/auth/me', 'Protected', 'Get current authenticated user'],
            ['PUT', '/api/auth/me', 'Protected', 'Update user profile and location'],
            ['GET', '/api/vehicles', 'User', 'List vehicles for current user'],
            ['POST', '/api/vehicles', 'User', 'Add a new vehicle'],
            ['PUT', '/api/vehicles/:id', 'User', 'Update vehicle details'],
            ['DELETE', '/api/vehicles/:id', 'User', 'Delete a vehicle'],
            ['GET', '/api/mechanics/nearby', 'User', 'Find nearby verified mechanics'],
            ['GET', '/api/mechanics/requests', 'Mechanic', 'View pending service requests'],
            ['GET', '/api/mechanics/jobs', 'Mechanic', 'View mechanic job history'],
            ['PUT', '/api/mechanics/profile', 'Mechanic', 'Update mechanic profile and pricing'],
            ['PUT', '/api/mechanics/location', 'Mechanic', 'Update mechanic location'],
            ['GET', '/api/mechanics/earnings', 'Mechanic', 'Get earnings summary'],
            ['GET', '/api/requests/types', 'Protected', 'Get available service types'],
            ['POST', '/api/requests', 'User', 'Create a new service request'],
            ['GET', '/api/requests', 'Protected', 'List requests (filtered by role)'],
            ['GET', '/api/requests/:id', 'Protected', 'Get request details'],
            ['PUT', '/api/requests/:id/accept', 'Mechanic', 'Accept a pending request'],
            ['PUT', '/api/requests/:id/status', 'Protected', 'Update request status'],
            ['PUT', '/api/requests/:id/rate', 'User', 'Rate a completed service'],
            ['GET', '/api/admin/dashboard', 'Admin', 'Get KPI dashboard data'],
            ['GET', '/api/admin/mechanics/pending', 'Admin', 'List pending mechanic applications'],
            ['PUT', '/api/admin/mechanics/:id/verify', 'Admin', 'Approve a mechanic'],
            ['PUT', '/api/admin/mechanics/:id/reject', 'Admin', 'Reject a mechanic application'],
            ['GET', '/api/admin/users', 'Admin', 'List all registered users'],
            ['GET', '/api/admin/requests', 'Admin', 'List all service requests'],
            ['PUT', '/api/admin/requests/:id/resolve', 'Admin', 'Resolve/cancel a request'],
            ['GET', '/api/health', 'Public', 'Health check endpoint'],
        ],
        [0.7, 2.3, 0.8, 2.2]
    )

    doc.add_heading('5.7 Frontend Component Architecture', level=2)
    add_body_text(doc, "Figure 7: Frontend Component Hierarchy")
    add_code_block(doc, """
    app/
    ├── layout.tsx (Root Layout + AuthProvider)
    ├── page.tsx (Landing Page)
    │   ├── Navbar
    │   ├── Hero
    │   ├── Stats
    │   ├── Features
    │   ├── Services
    │   ├── HowItWorks
    │   ├── LiveDemo
    │   ├── Testimonials
    │   ├── TrustSection
    │   ├── FAQ
    │   ├── CTA
    │   └── Footer
    ├── login/page.tsx (Login Form)
    ├── register/page.tsx (Registration Form)
    └── dashboard/
        ├── page.tsx (Role-based Redirect)
        ├── user/
        │   ├── page.tsx (User Dashboard + Request Flow)
        │   ├── vehicles/page.tsx (Vehicle Management)
        │   ├── request/page.tsx (New Service Request)
        │   ├── track/page.tsx (Live Service Tracking)
        │   ├── history/page.tsx (Service History)
        │   ├── profile/page.tsx (User Profile)
        │   └── settings/page.tsx (User Settings)
        ├── mechanic/
        │   ├── page.tsx (Mechanic Dashboard)
        │   ├── requests/page.tsx (Pending Requests)
        │   ├── jobs/page.tsx (Job History)
        │   ├── earnings/page.tsx (Earnings Dashboard)
        │   └── profile/page.tsx (Mechanic Profile)
        └── admin/
            ├── page.tsx (Admin KPI Dashboard)
            ├── verify/page.tsx (Partner Verification)
            ├── users/page.tsx (User Management)
            └── requests/page.tsx (Request Monitoring)
""")

    doc.add_heading('5.8 Authentication Flow', level=2)
    add_body_text(doc, "Figure 8: Authentication Flow Sequence Diagram")
    add_code_block(doc, """
    Client (Browser)           Express API              MongoDB
         │                         │                       │
         │── POST /auth/register ─►│                       │
         │                         │── Create User ───────►│
         │                         │◄── User Doc ──────────│
         │                         │── Sign JWT ──────────►│
         │◄── { user, token } ─────│                       │
         │                         │                       │
         │── Store token in ──────►│                       │
         │   localStorage          │                       │
         │                         │                       │
         │── GET /auth/me ────────►│                       │
         │   (Bearer token)        │── Verify JWT ────────►│
         │                         │── Find User ─────────►│
         │                         │◄── User Doc ──────────│
         │◄── User Data ───────────│                       │
         │                         │                       │
         │── Protected Route ─────►│                       │
         │   (Bearer token)        │── protect() ─────────►│
         │                         │── authorize() ───────►│
         │                         │── Route Handler ─────►│
""")

    doc.add_heading('5.9 Frontend Route Structure', level=2)
    add_formatted_table(doc,
        ['Path', 'Role', 'Page Component', 'Purpose'],
        [
            ['/', 'Public', 'Landing Page', 'Marketing page with features, services, testimonials'],
            ['/login', 'Public', 'Login Form', 'Email/password authentication'],
            ['/register', 'Public', 'Registration Form', 'User or mechanic registration'],
            ['/dashboard', 'Protected', 'Role Redirect', 'Redirects to role-specific dashboard'],
            ['/dashboard/user', 'User', 'User Dashboard', 'Overview with quick request flow'],
            ['/dashboard/user/vehicles', 'User', 'Vehicle Management', 'CRUD operations for vehicles'],
            ['/dashboard/user/request', 'User', 'New Request', 'Create service request'],
            ['/dashboard/user/track', 'User', 'Live Tracking', 'Real-time status tracking'],
            ['/dashboard/user/history', 'User', 'Service History', 'Past request records'],
            ['/dashboard/user/profile', 'User', 'User Profile', 'Profile management'],
            ['/dashboard/user/settings', 'User', 'Settings', 'Account settings'],
            ['/dashboard/mechanic', 'Mechanic', 'Mechanic Dashboard', 'Job overview and stats'],
            ['/dashboard/mechanic/requests', 'Mechanic', 'Pending Requests', 'Browse and accept jobs'],
            ['/dashboard/mechanic/jobs', 'Mechanic', 'Job History', 'Completed job records'],
            ['/dashboard/mechanic/earnings', 'Mechanic', 'Earnings', 'Revenue tracking'],
            ['/dashboard/mechanic/profile', 'Mechanic', 'Mechanic Profile', 'Business profile management'],
            ['/dashboard/admin', 'Admin', 'Admin Dashboard', 'KPI overview and monitoring'],
            ['/dashboard/admin/verify', 'Admin', 'Partner Verification', 'Approve/reject mechanics'],
            ['/dashboard/admin/users', 'Admin', 'User Management', 'View registered users'],
            ['/dashboard/admin/requests', 'Admin', 'All Requests', 'Platform-wide request monitoring'],
        ],
        [1.8, 0.7, 1.3, 2.2]
    )

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════
    # CHAPTER 6: IMPLEMENTATION
    # ══════════════════════════════════════════════════════════════════════

    doc.add_heading('Chapter 6: Implementation', level=1)

    doc.add_heading('6.1 Technology Stack', level=2)

    doc.add_heading('6.1.1 Frontend Technologies', level=3)
    add_formatted_table(doc,
        ['Technology', 'Version', 'Purpose'],
        [
            ['Next.js', '14.2.15', 'React framework with App Router, SSR, and file-based routing'],
            ['React', '18.3.1', 'UI component library for building interactive interfaces'],
            ['TypeScript', '5.6.3', 'Type-safe JavaScript superset for better DX and error prevention'],
            ['Tailwind CSS', '3.4.14', 'Utility-first CSS framework for responsive design'],
            ['Lucide React', '0.454.0', 'Modern icon library for consistent UI iconography'],
            ['PostCSS', '8.4.47', 'CSS transformation tool for Tailwind processing'],
            ['Autoprefixer', '10.4.20', 'CSS vendor prefix automation'],
        ],
        [1.5, 1.0, 3.5]
    )

    doc.add_heading('6.1.2 Backend Technologies', level=3)
    add_formatted_table(doc,
        ['Technology', 'Version', 'Purpose'],
        [
            ['Node.js', '18+', 'JavaScript runtime for server-side execution'],
            ['Express.js', '4.21.0', 'Minimal web framework for REST API development'],
            ['Mongoose', '8.7.0', 'MongoDB ODM for schema definition and data validation'],
            ['jsonwebtoken', '9.0.2', 'JWT generation and verification for authentication'],
            ['bcryptjs', '2.4.3', 'Password hashing library (12 salt rounds)'],
            ['cors', '2.8.5', 'Cross-Origin Resource Sharing middleware'],
            ['dotenv', '16.4.5', 'Environment variable management'],
            ['nodemon', '3.1.7', 'Development auto-reload server (dev dependency)'],
        ],
        [1.5, 1.0, 3.5]
    )

    doc.add_heading('6.2 Project Structure', level=2)
    add_code_block(doc, """
    roadside-vehicle-assistance/
    ├── backend/
    │   ├── config/
    │   │   └── db.js                  # MongoDB connection configuration
    │   ├── middleware/
    │   │   └── auth.js                # JWT protect() and authorize() middleware
    │   ├── models/
    │   │   ├── User.js                # User schema with embedded mechanic profile
    │   │   ├── Vehicle.js             # Vehicle schema linked to user
    │   │   └── ServiceRequest.js      # Service request with status lifecycle
    │   ├── routes/
    │   │   ├── auth.js                # Registration, login, profile endpoints
    │   │   ├── vehicles.js            # CRUD operations for vehicles
    │   │   ├── mechanics.js           # Nearby search, jobs, earnings, profile
    │   │   ├── serviceRequests.js     # Request CRUD, accept, status, rate
    │   │   └── admin.js               # Dashboard, verification, monitoring
    │   ├── utils/
    │   │   ├── helpers.js             # Haversine distance, ETA, pricing helpers
    │   │   └── seed.js                # Database seed script with demo data
    │   ├── server.js                  # Express app entry point
    │   ├── package.json               # Backend dependencies
    │   └── .env                       # Environment variables
    │
    ├── frontend/
    │   ├── app/
    │   │   ├── layout.tsx             # Root layout with AuthProvider
    │   │   ├── page.tsx               # Landing page
    │   │   ├── globals.css            # Global styles and Tailwind imports
    │   │   ├── login/page.tsx         # Login page
    │   │   ├── register/page.tsx      # Registration page
    │   │   └── dashboard/
    │   │       ├── page.tsx           # Dashboard role-redirect
    │   │       ├── user/              # User dashboard pages (7 pages)
    │   │       ├── mechanic/          # Mechanic dashboard pages (5 pages)
    │   │       └── admin/             # Admin dashboard pages (4 pages)
    │   ├── components/
    │   │   ├── Navbar.tsx             # Navigation bar with auth state
    │   │   ├── Hero.tsx               # Landing page hero section
    │   │   ├── Features.tsx           # Feature showcase
    │   │   ├── Services.tsx           # Service types display
    │   │   ├── HowItWorks.tsx         # Step-by-step guide
    │   │   ├── Stats.tsx              # Platform statistics
    │   │   ├── LiveDemo.tsx           # Interactive demo component
    │   │   ├── Testimonials.tsx       # User testimonials
    │   │   ├── TrustSection.tsx       # Trust indicators
    │   │   ├── FAQ.tsx                # Frequently asked questions
    │   │   ├── CTA.tsx                # Call to action
    │   │   ├── Footer.tsx             # Site footer
    │   │   ├── DashboardLayout.tsx    # Shared dashboard shell (sidebar + nav)
    │   │   └── ui.tsx                 # Reusable UI primitives
    │   ├── lib/
    │   │   ├── api.ts                 # API client with typed endpoints
    │   │   └── auth-context.tsx       # React Context for authentication
    │   ├── package.json               # Frontend dependencies
    │   ├── tailwind.config.js         # Tailwind CSS configuration
    │   ├── tsconfig.json              # TypeScript configuration
    │   └── next.config.js             # Next.js configuration
    │
    ├── docs/
    │   ├── PRD.md                     # Product Requirements Document
    │   └── TECHNICAL.md               # Technical Documentation
    │
    ├── server.js                      # Root wrapper for Render deployment
    ├── package.json                   # Root package.json
    └── README.md                      # Project documentation
""", "Project Directory Structure")

    doc.add_heading('6.3 Key Implementation Details', level=2)

    doc.add_heading('6.3.1 Haversine Distance Calculation', level=3)
    add_body_text(doc,
        "The platform uses the Haversine formula to calculate the great-circle distance between "
        "the user's breakdown location and each mechanic's current location. This formula accounts "
        "for the curvature of the Earth and provides accurate results for short to medium distances."
    )
    add_code_block(doc, """
const R = 6371; // Earth radius in kilometers

function haversineDistance(lat1, lon1, lat2, lon2) {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}""", "JavaScript — helpers.js")

    doc.add_heading('6.3.2 ETA Estimation Algorithm', level=3)
    add_body_text(doc,
        "The estimated time of arrival is calculated by assuming an average travel speed of 30 km/h "
        "in urban conditions, with a minimum ETA of 5 minutes."
    )
    add_code_block(doc, """
function estimateArrivalMinutes(distanceKm) {
  const avgSpeedKmh = 30;
  return Math.max(5, Math.round((distanceKm / avgSpeedKmh) * 60));
}""", "JavaScript — helpers.js")

    doc.add_heading('6.3.3 JWT Authentication Middleware', level=3)
    add_body_text(doc,
        "The authentication middleware extracts the JWT from the Authorization header, verifies "
        "it against the server secret, and attaches the authenticated user to the request object. "
        "The authorize function performs role-based access control."
    )
    add_code_block(doc, """
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    next();
  } catch {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied for this role' });
  }
  next();
};""", "JavaScript — middleware/auth.js")

    doc.add_heading('6.3.4 Service Request Lifecycle', level=3)
    add_body_text(doc,
        "The service request lifecycle is managed through a state machine pattern. Each status "
        "transition is recorded in the statusHistory array, creating a complete audit trail. "
        "Upon completion, the mechanic's earnings and job counters are automatically updated."
    )
    add_code_block(doc, """
const STATUS_FLOW = [
  'pending',      // User created the request
  'accepted',     // Mechanic accepted the job
  'en_route',     // Mechanic is traveling to location
  'arrived',      // Mechanic arrived at breakdown site
  'in_progress',  // Repair/service work in progress
  'completed',    // Service successfully completed
  'cancelled',    // Request cancelled by user/admin
];""", "JavaScript — models/ServiceRequest.js")

    doc.add_heading('6.3.5 Nearby Mechanic Discovery', level=3)
    add_body_text(doc,
        "When a user searches for nearby mechanics, the system queries all verified and available "
        "mechanics, calculates the Haversine distance from the user's location, filters mechanics "
        "within a 50 km radius, and sorts results by proximity. For each mechanic, the ETA and "
        "service pricing are computed dynamically."
    )

    doc.add_heading('6.3.6 Rating System', level=3)
    add_body_text(doc,
        "After a service is marked as completed, the user can rate the mechanic on a scale of "
        "1 to 5 stars with optional written feedback. The mechanic's average rating is recalculated "
        "using a weighted running average formula to maintain accuracy as ratings accumulate."
    )
    add_code_block(doc, """
// Running average calculation
const newTotal = currentTotalRatings + 1;
const newRating = (currentRating * currentTotalRatings + newRating) / newTotal;
// Rounded to 1 decimal place
mechanic.profile.rating = Math.round(newRating * 10) / 10;""", "JavaScript — Rating Calculation")

    doc.add_heading('6.4 Environment Configuration', level=2)

    doc.add_heading('6.4.1 Backend Environment Variables (.env)', level=3)
    add_code_block(doc, """
PORT=5000
MONGODB_URI=mongodb://localhost:27017/roadside_assistance
JWT_SECRET=<strong-secret-key>
NODE_ENV=development""", "Environment — Backend")

    doc.add_heading('6.4.2 Frontend Environment Variables (.env.local)', level=3)
    add_code_block(doc, """
NEXT_PUBLIC_API_URL=http://localhost:5000/api""", "Environment — Frontend")

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════
    # CHAPTER 7: TESTING
    # ══════════════════════════════════════════════════════════════════════

    doc.add_heading('Chapter 7: Testing', level=1)

    doc.add_heading('7.1 Testing Strategy', level=2)
    add_body_text(doc,
        "The application was tested using a combination of manual testing, API testing (using tools "
        "like Postman or curl), and UI testing. Test cases were designed to cover all functional "
        "requirements across all three user roles."
    )

    doc.add_heading('7.2 Test Cases — Authentication Module', level=2)
    add_formatted_table(doc,
        ['TC ID', 'Test Case', 'Input', 'Expected Output', 'Result'],
        [
            ['TC-01', 'User Registration (Valid)', 'Name, email, phone, password', '201 Created with JWT token', 'Pass'],
            ['TC-02', 'User Registration (Duplicate Email)', 'Existing email address', '400 Bad Request — Email already registered', 'Pass'],
            ['TC-03', 'User Registration (Missing Fields)', 'Empty name field', '400 Bad Request — Please provide all required fields', 'Pass'],
            ['TC-04', 'Login (Valid Credentials)', 'Correct email & password', '200 OK with JWT token and user data', 'Pass'],
            ['TC-05', 'Login (Invalid Password)', 'Wrong password', '401 Unauthorized — Invalid email or password', 'Pass'],
            ['TC-06', 'Login (Non-existent Email)', 'Unregistered email', '401 Unauthorized — Invalid email or password', 'Pass'],
            ['TC-07', 'Access Protected Route (Valid Token)', 'Valid JWT in header', '200 OK with user data', 'Pass'],
            ['TC-08', 'Access Protected Route (No Token)', 'No Authorization header', '401 Unauthorized — Not authorized, no token', 'Pass'],
            ['TC-09', 'Access Protected Route (Expired Token)', 'Expired JWT token', '401 Unauthorized — Not authorized, token invalid', 'Pass'],
            ['TC-10', 'Mechanic Registration', 'Role=mechanic, businessName, license', '201 Created with isVerified=false', 'Pass'],
        ],
        [0.6, 1.5, 1.3, 1.8, 0.5]
    )

    doc.add_heading('7.3 Test Cases — Service Request Module', level=2)
    add_formatted_table(doc,
        ['TC ID', 'Test Case', 'Input', 'Expected Output', 'Result'],
        [
            ['TC-11', 'Create Service Request (Valid)', 'vehicleId, serviceType, location', '201 Created with pending status', 'Pass'],
            ['TC-12', 'Create Request (Missing Vehicle)', 'Invalid vehicleId', '404 Vehicle not found', 'Pass'],
            ['TC-13', 'Create Request (Missing Location)', 'No coordinates', '400 Missing required fields', 'Pass'],
            ['TC-14', 'Find Nearby Mechanics', 'User coordinates (lng, lat)', '200 OK with sorted mechanic list', 'Pass'],
            ['TC-15', 'Accept Request (Verified Mechanic)', 'Pending request ID', '200 OK with status=accepted', 'Pass'],
            ['TC-16', 'Accept Request (Unverified Mechanic)', 'Pending request, unverified mechanic', '403 Account not verified', 'Pass'],
            ['TC-17', 'Update Status (en_route)', 'request ID, status=en_route', '200 OK with updated status', 'Pass'],
            ['TC-18', 'Complete Service', 'status=completed, finalPrice', '200 OK, mechanic earnings updated', 'Pass'],
            ['TC-19', 'Rate Completed Service', 'rating=5, feedback text', '200 OK, mechanic rating recalculated', 'Pass'],
            ['TC-20', 'Cancel Request (By User)', 'status=cancelled', '200 OK with cancelled status', 'Pass'],
        ],
        [0.6, 1.5, 1.5, 1.6, 0.5]
    )

    doc.add_heading('7.4 Test Cases — Admin Module', level=2)
    add_formatted_table(doc,
        ['TC ID', 'Test Case', 'Input', 'Expected Output', 'Result'],
        [
            ['TC-21', 'Admin Dashboard KPIs', 'Admin JWT token', '200 OK with stats object', 'Pass'],
            ['TC-22', 'View Pending Mechanics', 'Admin token', '200 OK with pending mechanic list', 'Pass'],
            ['TC-23', 'Verify Mechanic', 'mechanic ID', '200 OK with isVerified=true', 'Pass'],
            ['TC-24', 'Reject Mechanic', 'mechanic ID', '200 OK, mechanic deleted', 'Pass'],
            ['TC-25', 'View All Users', 'Admin token', '200 OK with user list (no passwords)', 'Pass'],
            ['TC-26', 'Resolve Disputed Request', 'request ID, status, note', '200 OK with updated request', 'Pass'],
            ['TC-27', 'Non-Admin Access Dashboard', 'User JWT token', '403 Access denied for this role', 'Pass'],
        ],
        [0.6, 1.5, 1.5, 1.6, 0.5]
    )

    doc.add_heading('7.5 Demo Test Accounts', level=2)
    add_formatted_table(doc,
        ['Role', 'Email', 'Password', 'Notes'],
        [
            ['Admin', 'admin@roadside.com', 'admin123', 'Full platform access'],
            ['User', 'user@roadside.com', 'user123', 'Vehicle owner with pre-registered vehicle'],
            ['Mechanic (Verified)', 'rajesh@roadside.com', 'mech123', 'Quick Fix Auto — 8 years experience'],
            ['Mechanic (Verified)', 'suresh@roadside.com', 'mech123', 'Highway Tow Services — 12 years experience'],
            ['Mechanic (Pending)', 'amit@roadside.com', 'mech123', 'City Auto Care — Awaiting verification'],
        ],
        [1.2, 1.5, 1.0, 2.3]
    )

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════
    # CHAPTER 8: SCREENSHOTS / OUTPUT
    # ══════════════════════════════════════════════════════════════════════

    doc.add_heading('Chapter 8: Screenshots & Output', level=1)

    add_body_text(doc,
        "This chapter presents the key screens and outputs of the Roadside Vehicle Assistance & "
        "Mechanic Booking Platform. Due to the document format, representative descriptions of "
        "each screen are provided below. Actual screenshots can be captured by running the "
        "application locally."
    )

    screens = [
        ("8.1 Landing Page (Home)", "The landing page features a modern, gradient-themed hero section with a prominent 'Get Help Now' call-to-action button. It includes platform statistics (total users, response time, satisfaction rating), a feature showcase section, service type cards (breakdown repair, towing, battery jump-start, etc.), a 'How It Works' step-by-step guide, an interactive live demo, user testimonials, trust indicators, a FAQ accordion, and a comprehensive footer with navigation links."),
        ("8.2 Login Page", "A clean, centered login form with email and password fields, form validation, and links to the registration page. The design uses a card-based layout with subtle shadows and the platform branding."),
        ("8.3 Registration Page", "A registration form supporting both vehicle owner and mechanic registration. When 'mechanic' role is selected, additional fields for business name and license number appear dynamically. The form includes client-side validation for all required fields."),
        ("8.4 User Dashboard", "The user dashboard provides an overview of the user's activity with quick access cards for requesting assistance, managing vehicles, viewing service history, and tracking active requests. It includes a multi-step service request flow directly from the dashboard: select vehicle → choose service type → share location → pick a mechanic → confirm and submit."),
        ("8.5 Vehicle Management", "A paginated list of the user's registered vehicles displayed as cards, each showing make, model, year, license plate, color, and fuel type. Includes buttons for adding new vehicles and editing/deleting existing ones. The add/edit form validates all required fields."),
        ("8.6 Nearby Mechanics View", "A list of nearby mechanics sorted by distance, showing each mechanic's business name, rating (star display), distance in km, estimated arrival time, and pricing for the selected service type. Each card has a 'Book' button to create a service request."),
        ("8.7 Live Service Tracking", "A real-time tracking view showing the current status of an active service request with a visual step indicator (pending → accepted → en route → arrived → in progress → completed). It displays the assigned mechanic's details, estimated arrival time, and the full status history timeline."),
        ("8.8 Service History", "A paginated list of past service requests showing service type, date, status badge (color-coded), mechanic name, vehicle used, and price. Each record can be expanded to view full details. Completed services show the rating option if not yet rated."),
        ("8.9 Mechanic Dashboard", "The mechanic dashboard shows active job stats, pending request count, and recent job cards. It includes quick links to view pending requests, update profile/pricing, check earnings, and update availability status."),
        ("8.10 Mechanic Pending Requests", "A list of all pending service requests from users, showing user name, vehicle details, service type, breakdown location address, and distance from the mechanic. Each card has an 'Accept' button to take on the job."),
        ("8.11 Mechanic Earnings", "An earnings dashboard displaying total earnings, total completed jobs, and a list of recent completed jobs with individual earnings per job."),
        ("8.12 Admin KPI Dashboard", "A comprehensive admin dashboard with KPI cards showing total users, verified mechanics, pending mechanic applications, active service requests, completed requests, average rating, and partner acceptance rate. Below the KPIs, a table lists the 10 most recent service requests."),
        ("8.13 Admin Partner Verification", "A list of pending mechanic applications with details including business name, license number, contact information, and experience. Each application has 'Approve' and 'Reject' buttons for admin action."),
        ("8.14 Admin Request Monitoring", "A full list of all service requests on the platform with filtering and status information. Admins can view details and resolve/cancel disputed requests with admin notes."),
    ]

    for title, desc in screens:
        doc.add_heading(title, level=2)
        add_body_text(doc, desc)
        # placeholder box
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(f'[ Screenshot: {title.split(" ", 1)[1] if " " in title else title} ]')
        run.font.size = Pt(10)
        run.font.color.rgb = RGBColor(150, 150, 150)
        run.italic = True
        doc.add_paragraph()

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════
    # CHAPTER 9: DEPLOYMENT
    # ══════════════════════════════════════════════════════════════════════

    doc.add_heading('Chapter 9: Deployment', level=1)

    doc.add_heading('9.1 Deployment Architecture', level=2)
    add_body_text(doc, "Figure 9: Deployment Architecture")
    add_code_block(doc, """
    ┌─────────────────────┐        ┌─────────────────────┐
    │   Vercel / Netlify  │        │  Render / Railway   │
    │   (Frontend)        │──────► │  (Backend API)      │
    │                     │        │                     │
    │   Next.js Build     │  HTTPS │  Express.js Server  │
    │   Static + SSR      │        │  Node.js Runtime    │
    └─────────────────────┘        └──────────┬──────────┘
                                              │
                                   ┌──────────▼──────────┐
                                   │   MongoDB Atlas     │
                                   │   (Cloud Database)  │
                                   │                     │
                                   │   Cluster: M0 Free  │
                                   │   Region: Mumbai    │
                                   └─────────────────────┘
""")

    doc.add_heading('9.2 Deployment Steps', level=2)
    doc.add_heading('9.2.1 Backend Deployment (Render)', level=3)
    add_numbered_list(doc, [
        "Push code to GitHub repository",
        "Create a new Web Service on Render",
        "Connect the GitHub repository",
        "Set the build command: npm install --prefix backend",
        "Set the start command: node server.js",
        "Configure environment variables: MONGODB_URI, JWT_SECRET, NODE_ENV=production",
        "Deploy and verify the /api/health endpoint returns status: ok",
    ])

    doc.add_heading('9.2.2 Frontend Deployment (Vercel)', level=3)
    add_numbered_list(doc, [
        "Push code to GitHub repository",
        "Import the repository in Vercel",
        "Set the root directory to 'frontend'",
        "Configure the NEXT_PUBLIC_API_URL environment variable with the deployed backend URL",
        "Deploy and verify the application loads correctly",
    ])

    doc.add_heading('9.2.3 Database Setup (MongoDB Atlas)', level=3)
    add_numbered_list(doc, [
        "Create a MongoDB Atlas account and cluster (M0 free tier)",
        "Create a database user with read/write permissions",
        "Whitelist the backend server's IP address (or 0.0.0.0/0 for development)",
        "Copy the connection string to the backend's MONGODB_URI environment variable",
        "Run the seed script to populate demo data: npm run seed",
    ])

    doc.add_heading('9.3 Deployment Checklist', level=2)
    add_formatted_table(doc,
        ['Step', 'Description', 'Status'],
        [
            ['1', 'Set production JWT_SECRET (strong, unique value)', 'Required'],
            ['2', 'Configure MongoDB Atlas connection string', 'Required'],
            ['3', 'Deploy backend to Render/Railway/AWS', 'Required'],
            ['4', 'Set NEXT_PUBLIC_API_URL on frontend', 'Required'],
            ['5', 'Deploy frontend to Vercel/Netlify', 'Required'],
            ['6', 'Enable CORS for production domain on backend', 'Required'],
            ['7', 'Run seed script for initial demo data', 'Optional'],
            ['8', 'Configure custom domain names', 'Optional'],
            ['9', 'Set up monitoring and logging', 'Recommended'],
        ],
        [0.5, 4.0, 1.5]
    )

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════
    # CHAPTER 10: CONCLUSION AND FUTURE SCOPE
    # ══════════════════════════════════════════════════════════════════════

    doc.add_heading('Chapter 10: Conclusion and Future Scope', level=1)

    doc.add_heading('10.1 Conclusion', level=2)
    add_body_text(doc,
        "The Roadside Vehicle Assistance & Mechanic Booking Platform has been successfully designed, "
        "developed, and tested as a comprehensive full-stack web application. The platform effectively "
        "addresses the real-world challenges faced by vehicle owners during breakdowns by providing "
        "an integrated digital solution that connects them with verified nearby mechanics and towing "
        "service providers."
    )
    add_body_text(doc,
        "The project demonstrates proficiency in modern web development technologies including "
        "Next.js 14 with React and TypeScript for the frontend, Node.js with Express.js for the "
        "backend REST API, and MongoDB with Mongoose for data persistence. Key technical achievements "
        "include the implementation of geospatial queries using the Haversine formula for nearby "
        "mechanic discovery, JWT-based authentication with role-based access control, a comprehensive "
        "service request lifecycle management system, and an admin dashboard with real-time KPI "
        "monitoring."
    )
    add_body_text(doc,
        "The platform supports three distinct user roles — vehicle owners, mechanics/towing partners, "
        "and administrators — each with a tailored dashboard experience. All 19 functional requirements "
        "identified in the analysis phase have been successfully implemented and tested. The "
        "application is responsive, production-ready, and deployable on modern cloud infrastructure."
    )
    add_body_text(doc,
        "This project has provided valuable hands-on experience in full-stack web development, "
        "database design, API architecture, authentication systems, geospatial computing, and "
        "modern UI/UX design principles."
    )

    doc.add_heading('10.2 Key Performance Indicators', level=2)
    add_formatted_table(doc,
        ['KPI Metric', 'Description', 'Implementation'],
        [
            ['Total Service Requests', 'Count of all service requests on the platform', 'MongoDB countDocuments aggregation'],
            ['Average Response Time', 'Mean ETA across all accepted requests', 'Computed from estimatedArrivalMinutes field'],
            ['Service Completion Rate', 'Percentage of requests that reach "completed" status', 'Completed / Total requests ratio'],
            ['User Satisfaction Rating', 'Average rating (1–5 stars) across all rated services', 'MongoDB $avg aggregation on rating field'],
            ['Partner Acceptance Rate', 'Percentage of requests accepted by mechanics', 'Accepted / Total requests ratio'],
        ],
        [1.5, 2.0, 2.5]
    )

    doc.add_heading('10.3 Future Enhancements (Phase 2+)', level=2)
    add_bullet_list(doc, [
        "Online Payment Integration: Integrate payment gateways (Razorpay, Stripe) for cashless transactions with automatic invoicing",
        "Mobile Application: Develop native iOS and Android apps with SOS button for one-tap emergency assistance",
        "Real-time Communication: Implement WebSocket-based real-time updates replacing polling, with push notifications",
        "AI-powered ETA: Use machine learning models trained on historical data for more accurate ETA predictions",
        "Insurance Integration: Partner with insurance companies for direct claim processing through the platform",
        "Spare Parts Ordering: Add spare parts catalog and ordering capability for mechanics",
        "Multi-language Support: Implement internationalization (i18n) for regional language support",
        "Advanced Analytics: Implement detailed analytics dashboards with charts, graphs, and predictive insights",
        "Driver Safety Features: SOS button, emergency contacts, breakdown history heatmaps",
        "Subscription Plans: Introduce monthly/annual membership plans for frequent users with discounted rates",
    ])

    doc.add_heading('10.4 Lessons Learned', level=2)
    add_bullet_list(doc, [
        "Full-stack architecture design with clear separation of concerns improves maintainability",
        "GeoJSON and 2dsphere indexes in MongoDB are powerful for location-based features",
        "JWT-based stateless authentication simplifies horizontal scaling",
        "TypeScript significantly reduces runtime errors and improves developer experience",
        "Role-based access control should be enforced on both frontend (routing) and backend (middleware)",
        "Polling-based updates are simpler to implement but WebSockets are more efficient for real-time features",
        "Seed data is essential for testing and demo purposes during development",
    ])

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════
    # CHAPTER 11: BIBLIOGRAPHY / REFERENCES
    # ══════════════════════════════════════════════════════════════════════

    doc.add_heading('Chapter 11: Bibliography', level=1)

    references = [
        "[1] Next.js Documentation — https://nextjs.org/docs — Vercel Inc., 2024.",
        "[2] React Documentation — https://react.dev — Meta Platforms Inc., 2024.",
        "[3] Express.js Documentation — https://expressjs.com — OpenJS Foundation, 2024.",
        "[4] MongoDB Documentation — https://www.mongodb.com/docs — MongoDB Inc., 2024.",
        "[5] Mongoose ODM Documentation — https://mongoosejs.com/docs — Automattic Inc., 2024.",
        "[6] JSON Web Tokens (JWT) — https://jwt.io — Auth0 Inc., 2024.",
        "[7] Tailwind CSS Documentation — https://tailwindcss.com/docs — Tailwind Labs Inc., 2024.",
        "[8] Node.js Documentation — https://nodejs.org/docs — OpenJS Foundation, 2024.",
        "[9] GeoJSON Specification (RFC 7946) — https://geojson.org — Internet Engineering Task Force, 2016.",
        "[10] Haversine Formula — Sinnott, R.W., 'Virtues of the Haversine,' Sky and Telescope, Vol. 68, No. 2, p. 159, 1984.",
        "[11] REST API Design Best Practices — https://restfulapi.net — REST API Tutorial, 2024.",
        "[12] bcrypt.js — https://github.com/dcodeIO/bcrypt.js — Daniel Wirtz, 2024.",
        "[13] Lucide Icons — https://lucide.dev — Lucide Contributors, 2024.",
        "[14] TypeScript Documentation — https://www.typescriptlang.org/docs — Microsoft, 2024.",
        "[15] MongoDB Atlas — https://www.mongodb.com/atlas — MongoDB Inc., 2024.",
        "[16] Vercel Deployment — https://vercel.com/docs — Vercel Inc., 2024.",
        "[17] Render Deployment — https://render.com/docs — Render Inc., 2024.",
    ]

    for ref in references:
        p = doc.add_paragraph(ref)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.left_indent = Inches(0.5)
        p.paragraph_format.first_line_indent = Inches(-0.5)
        for run in p.runs:
            run.font.size = Pt(11)

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════
    # APPENDIX A: SETUP INSTRUCTIONS
    # ══════════════════════════════════════════════════════════════════════

    doc.add_heading('Appendix A: Setup and Installation Guide', level=1)

    doc.add_heading('A.1 Prerequisites', level=2)
    add_bullet_list(doc, [
        "Node.js 18 or higher (https://nodejs.org)",
        "MongoDB (local installation or MongoDB Atlas cloud account)",
        "Git for version control",
        "A modern web browser (Chrome, Firefox, Edge)",
        "Code editor (VS Code recommended)",
    ])

    doc.add_heading('A.2 Backend Setup', level=2)
    add_code_block(doc, """
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/roadside_assistance
# JWT_SECRET=your_strong_secret_key

# Load demo/seed data
npm run seed

# Start the development server
npm run dev
# Server starts at http://localhost:5000""", "Terminal Commands — Backend")

    doc.add_heading('A.3 Frontend Setup', level=2)
    add_code_block(doc, """
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Edit .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start the development server
npm run dev
# Application starts at http://localhost:3000""", "Terminal Commands — Frontend")

    doc.add_heading('A.4 Accessing the Application', level=2)
    add_body_text(doc,
        "Open a web browser and navigate to http://localhost:3000. Use the demo accounts listed "
        "in Chapter 7, Section 7.5 to log in with different roles and explore the platform features."
    )

    # ── Page Numbers ──
    add_page_numbers(doc)

    # ── Save Document ──
    output_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(output_dir, 'Roadside_Vehicle_Assistance_Project_Report.docx')
    doc.save(output_path)
    print(f'\n[OK] Report generated successfully!')
    print(f'File: {output_path}')
    print(f'Pages: ~45-50 (estimated)')
    print(f'\nTIP: Open the document in Microsoft Word, then:')
    print(f'   1. Right-click the Table of Contents -> "Update Field" -> "Update entire table"')
    print(f'   2. Press Ctrl+A, then F9 to update all fields (including page numbers)')


if __name__ == '__main__':
    generate_report()
