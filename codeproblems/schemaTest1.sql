CREATE TABLE department (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  description VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE address (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  street_address_1 VARCHAR(255) NOT NULL,
  street_address_2 VARCHAR(255),
  city VARCHAR(255) NOT NULL,
  state VARCHAR(2) NOT NULL,
  zip VARCHAR(5) NOT NULL,
  zip_ext VARCHAR(4),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE employee (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(255) NOT NULL,
  middle_name VARCHAR(255),
  last_name VARCHAR(255) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  address_id BIGINT,
  department_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (address_id) REFERENCES address(id) ON DELETE SET NULL,
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE RESTRICT
);

CREATE INDEX idx_employee_address_id ON employee(address_id);
CREATE INDEX idx_employee_department_id ON employee(department_id);
CREATE INDEX idx_employee_last_name ON employee(last_name);


-- ============================================================================
-- INTERVIEW QUESTIONS: Identify the problems in these table designs
-- ============================================================================

-- QUESTION 1: What's wrong with this employee_bad table?
-- (Hint: There are at least 5 issues)
/*
CREATE TABLE employee_bad (
  id INT,
  name VARCHAR(50),
  salary FLOAT,
  dept VARCHAR(100),
  manager_name VARCHAR(100),
  address VARCHAR(500),
  created DATE
);
*/
-- ANSWER:
-- 1. No PRIMARY KEY defined
-- 2. 'name' should be split into first_name, last_name (1NF violation)
-- 3. FLOAT for salary loses precision - use DECIMAL
-- 4. 'dept' should be a foreign key, not denormalized text (2NF violation)
-- 5. 'manager_name' should reference employee id, not store name (redundancy)
-- 6. 'address' should be a separate table (1NF violation, multi-valued)
-- 7. No NOT NULL constraints on required fields
-- 8. No AUTO_INCREMENT on id
-- 9. DATE instead of TIMESTAMP loses time precision


-- QUESTION 2: What problems exist in this order system?
-- (Hint: Normalization and data integrity issues)
/*
CREATE TABLE orders_bad (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_name VARCHAR(100),
  customer_email VARCHAR(100),
  customer_phone VARCHAR(20),
  product_name VARCHAR(100),
  product_price DECIMAL(10,2),
  quantity INT,
  order_date TIMESTAMP
);
*/
-- ANSWER:
-- 1. Customer data repeated for every order (2NF violation) - should be separate table
-- 2. Product data embedded (2NF violation) - should reference products table
-- 3. No foreign keys - can't enforce referential integrity
-- 4. If customer changes email, must update ALL their orders
-- 5. If product price changes, historical orders lose original price
-- 6. No order status tracking
-- 7. No shipping address (might differ from customer address)


-- QUESTION 3: What's wrong with this audit log?
/*
CREATE TABLE audit_log_bad (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  table_name VARCHAR(50),
  action VARCHAR(10),
  old_values TEXT,
  new_values TEXT,
  changed_by INT,
  changed_at TIMESTAMP
);
*/
-- ANSWER:
-- 1. Storing JSON/text in old_values/new_values is not queryable
-- 2. No foreign key on changed_by (could reference non-existent user)
-- 3. No index on table_name or changed_at (common query patterns)
-- 4. No record_id to identify which specific record changed
-- 5. action should be ENUM('INSERT','UPDATE','DELETE') not open VARCHAR


-- QUESTION 4: Spot the circular dependency and design flaw
/*
CREATE TABLE team_bad (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  lead_employee_id BIGINT,
  FOREIGN KEY (lead_employee_id) REFERENCES employee_v2(id)
);

CREATE TABLE employee_v2 (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  team_id BIGINT NOT NULL,
  FOREIGN KEY (team_id) REFERENCES team_bad(id)
);
*/
-- ANSWER:
-- 1. Circular dependency: team needs employee, employee needs team
-- 2. Cannot insert first record in either table (chicken-egg problem)
-- 3. Solution: Make one FK nullable, or use a junction table for team leads


-- ============================================================================
-- POTENTIAL TABLES: Good examples extending current schema
-- ============================================================================

-- Example: Employee roles/positions with salary bands
/*
CREATE TABLE position (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  min_salary DECIMAL(10,2) NOT NULL,
  max_salary DECIMAL(10,2) NOT NULL,
  department_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE RESTRICT,
  CONSTRAINT chk_salary_range CHECK (min_salary <= max_salary)
);

CREATE INDEX idx_position_department_id ON position(department_id);
*/


-- Example: Employee job history (tracks promotions/transfers)
/*
CREATE TABLE employee_position_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  employee_id BIGINT NOT NULL,
  position_id BIGINT NOT NULL,
  department_id BIGINT NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
  FOREIGN KEY (position_id) REFERENCES position(id) ON DELETE RESTRICT,
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE RESTRICT,
  CONSTRAINT chk_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX idx_eph_employee_id ON employee_position_history(employee_id);
CREATE INDEX idx_eph_current ON employee_position_history(is_current) WHERE is_current = TRUE;
*/


--  Example: Department hierarchy (for org charts)
/*
CREATE TABLE department_hierarchy (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  department_id BIGINT NOT NULL UNIQUE,
  parent_department_id BIGINT,
  level INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_department_id) REFERENCES department(id) ON DELETE SET NULL
);
*/


-- Example: Employee emergency contacts (one-to-many relationship)
/*
CREATE TABLE emergency_contact (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  employee_id BIGINT NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  relationship VARCHAR(50) NOT NULL,
  phone_primary VARCHAR(20) NOT NULL,
  phone_secondary VARCHAR(20),
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

CREATE INDEX idx_ec_employee_id ON emergency_contact(employee_id);
*/


-- ============================================================================
-- BONUS QUESTION: Write a query to find employees earning above department average
-- ============================================================================
/*
SELECT e.id, e.first_name, e.last_name, e.salary, d.name as department, dept_avg.avg_salary
FROM employee e
JOIN department d ON e.department_id = d.id
JOIN (
    SELECT department_id, AVG(salary) as avg_salary
    FROM employee
    GROUP BY department_id
) dept_avg ON e.department_id = dept_avg.department_id
WHERE e.salary > dept_avg.avg_salary
ORDER BY d.name, e.salary DESC;
*/