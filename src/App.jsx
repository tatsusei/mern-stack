// const initialIssues = [{
//     id: 1,
//     status: 'New',
//     owner: 'Ravan',
//     effort: 5,
//     created: new Date('2018-08-15'),
//     due: undefined,
//     title: 'Error in console when clicking Add',
// },
// {
//     id: 2,
//     status: 'Assigned',
//     owner: 'Eddie',
//     effort: 14,
//     created: new Date('2018-08-16'),
//     due: new Date('2018-08-30'),
//     title: 'Missing bottom border on panel',
// },
// ];

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value); 
    return value;
}

class IssueFilter extends React.Component {
    render() {
        return (
            <div>This is a placeholder for the issue filter.</div>
        );
    }
};

function IssueTable(props){
    const issueRows = props.issues.map(issue =>
        <IssueRow key={issue.id} issue={issue} />
    )
    return (
        <table className="bordered-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>Created</th>
                    <th>Effort</th>
                    <th>Due Date</th>
                    <th>Title</th>
                </tr>
            </thead>
            <tbody>
                {issueRows}
            </tbody>
        </table>
    )
}

function IssueRow (props) {
    const issue = props.issue;
    return (
        <tr>
            <td>{issue.id}</td>
            <td>{issue.status}</td>
            <td>{issue.owner}</td>
            <td>{issue.created.toDateString()}</td>
            <td>{issue.effort}</td>
            <td>{issue.due ? issue.due.toDateString(): ''}</td>
            <td>{issue.title}</td>
        </tr>
    );
}

class IssueAdd extends React.Component {
    constructor(){
        super();
        // setTimeout(() => { 
        //     this.props.createIssue(sampleIssue);
        // }, 2000);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.issueAdd;
        const issue = {
            owner: form.owner.value, 
            title: form.title.value, 
            // status: 'New'
            due: new Date(new Date().getTime() + 1000*60*60*24*10)
        }

        this.props.createIssue(issue);
        form.owner.value="";
        form.title.value="";
    }

    render() {
        return (
            <form name="issueAdd" onSubmit={this.handleSubmit}> 
                <input type="text" name="owner" placeholder="Owner" />
                <input type="text" name="title" placeholder="Title" />
                <button>Add</button>
            </form>
        );
    }
}

class IssueList extends React.Component {
    constructor() {
        super()
        this.state = { issues: [] }
        this.createIssue = this.createIssue.bind(this);
    }

    async createIssue(issue) {
        const query = `mutation {
            issueAdd(issue:{
                title:"${issue.title}",
                owner:"${issue.owner}",
                due:"${issue.due.toISOString()}",
            }){
                id
            }
        }`;

        const response = await fetch('/graphql', {
            method:'POST',
            headers:{ 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        })

        this.loadData();

        // issue.id = this.state.issues.length + 1;
        // issue.created = new Date();
        // const newIssueList = this.state.issues.slice();
        // newIssueList.push(issue);
        // this.setState({ issues: newIssueList });

        //const addedIssues = [...this.state.issues, issue]
        //this.setState({ ...this.state.issues, issues: addedIssues});
    }

    componentDidMount() {
        this.loadData()
    }

    async loadData() {
        const query= `query {
            issueList {
                id
                title
                status
                owner
                created
                effort
                due
            }
        }`;

        const response = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ query })
        });
        // const result = await response.json();
        const body = await response.text();
        const result = JSON.parse(body, jsonDateReviver)
        this.setState({ issues: result.data.issueList })
        // setTimeout(() => {
        //     this.setState({ issues: initialIssues })
        // }, 500)
    }

    render() {
        return (
            <React.Fragment>
                <h1>Issue Tracker</h1>
                <IssueFilter />
                <hr />
                <IssueTable issues={this.state.issues}/>
                <hr />
                <IssueAdd createIssue={this.createIssue}/>
            </React.Fragment>
        );
    }
}
const element = <IssueList />;

ReactDOM.render(element, document.getElementById('contents'))