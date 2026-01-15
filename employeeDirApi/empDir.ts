//create a empoyee directory using a Rest API I will use express  & ts

//questions about the emp ID, should I auto generate it starting from 1 or will
// the client provide it? starting form 1 avoids collisions and I can change if needed
// later.
// What fields when checking emp are required? If they are not req I can return unassigned.
// salary should be required due to payroll needing info.
// hire date if missing can I use today(I will add seconds and abstract this away from outputs)?
// sorting seems we will asc and des as salary will be des will most first(decending) and hire Date
// we will asc for hire date for earliest first(ascending)..
// Filtering by dept case sensitive? if db has engineering and someone looks for Enginneering should 
// it return nothing or engineering?(toLowerCase on both sides of the comparison)
// Put for endpoint seems to call for a patch as we are not updating ID as this shoud be immutable.
// no mention of delete so this should throw a 405, so it doesnt catch a 404?

// Thoughts on DSA... I could use a object a array to store the empoloyees in local memory rn, but thats wack 
// im better then that,  I could use a plain JS object, but then I intruduce a JS gotcha, as JS converts all to 
// a string and we need numbers for IDs. Also objects do not have a clean way to get all values, for this we need 
// A good ole fashion Map num keys and emp values. Map has our size value we can call.
// Generating IDs we can use a simple ++ counter starting from 1. add emp increments to 2 etc.

import express, { Request, Response } from 'express';

interface Employee {
    id: number;
    name: string;
    department: string;
    salary: number;
    hireDate: string; // ISO string 
}


const app = express();
app.use(express.json());

const store = new Map<number, Employee>();
let nextId = 1;

// Create emp endpoint for all post requests
app.post('/employees', (req: Request, res: Response) => {
    const {name, department, salary, hireDate} = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({error: 'Name is required'});
    }
    if (typeof salary !== 'number' || salary < 0 || Number.isNaN(salary)) {
        return res.status(400).json({error: 'Salary must be a positive number'});
    }
    const employee: Employee = {
        id: nextId++,
        name: name.trim(),
        department: department ? department.trim() : 'Unassigned',
        salary,
        hireDate: hireDate || new Date().toISOString().split('T')[0] 
    }
    store.set(employee.id, employee);
    res.status(201).json(employee);
});

//Get all employees with ? filtering and sort, always filter then sort  to save resources
app.get('/employees', (req: Request, res:  Response) => {
    const sortBy = (req.query.sortBy as string) || 'hireDate';
    const departmentFileter = req.query.department as string;

    let employees = Array.from(store.values());

    if(departmentFileter) {
        employees = employees.filter(e => e.department.toLowerCase() === departmentFileter.toLowerCase()
    );
    }
    if(sortBy === 'salary') {
        employees.sort((a, b) => b.salary - a.salary);
    } else {
        employees.sort((a, b) =>
        new Date(a.hireDate).getTime() - new Date(b.hireDate).getTime()
);

    }
    return res.status(200).json(employees);

});

app.get('/employees/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    if(Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid employee ID'});
}

    const employee = store.get(id);
    if(!employee) {
        return res.status(404).json({ error: 'Employee not found'});
    }
    return res.status(200).json(employee);
});

app.put('/employees/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    if(Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid employee ID' });

    }

    const existingEmployee = store.get(id);
    if(!existingEmployee) {
        return res.status(404).json({ error: 'Employee not found'});

    }

    const { name, department, salary, hireDate} = req.body;

    const updatedEmployee: Employee = {
        id: existingEmployee.id,
        name: (name && typeof name === 'string' && name.trim() ? name.trim() : existingEmployee.name),
        department: department || existingEmployee.department,
        salary: (typeof salary === 'number' && salary >= 0) ? salary : existingEmployee.salary,
        hireDate: hireDate || existingEmployee.hireDate
    };
    
    store.set(id, updatedEmployee);
    return res.status(200).json(updatedEmployee);
});

//directions didnt mention delete so we will yolo all with a 405

app.delete('/employees/:id', (req: Request, res: Response) => {
    return res.status(405).json({ error: 'Method not allowed'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Employee Dir is running on on port ${PORT}`)
})

export default app;

//get all employees is currently o(n) due to filtering, but we can optimize if needed later with a dept index map
// we can also optimize sorting with a sorted DS if needed later. We are filtering before sorting to be as performant as 
// we can with our current structure, I wish I could use VSCODE as browser editors while people watch is ruff.
//next I would start creating the from endc to run against this glorious api.

//Get employee by ID is O(1) like a boss due to our map, I tend to use maps in prod often, on most teams I have been on.
// Create emp is also O(1) due to our map insert, it may be simple but IT WORKS!!
