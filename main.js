var figures = {
    "9.2": [
        "Blimpy is-a Managers",
        "Managers ako Competitors",
        "Competitors ako Dwarfs",
        "Dwarfs ako Everything"
    ],
    "9.4": [
        "Blimpy is-a Managers",
        "Blimpy is-a Gourmands",
        "Blimpy is-a Diarists",
        "Managers ako Competitors",
        "Competitors ako Dwarfs",
        "Gourmands ako Dwarfs",
        "Diarists ako Dwarfs",
        "Dwarfs ako Everything"
    ],
    "9.5": [
        "Crazy is-a Professors",
        "Crazy is-a Hackers",
        "Professors ako Eccentrics",
        "Professors ako Teachers",
        "Hackers ako Programmers",
        "Eccentrics ako Dwarfs",
        "Teachers ako Dwarfs",
        "Programmers ako Dwarfs",
        "Jackue is-a Weightlifters",
        "Jackue is-a Shotputters",
        "Weightlifters ako Athletes",
        "Weightlifters ako Endomorphs",
        "Shotputters ako Endomorphs",
        "Athletes ako Dwarfs",
        "Endomorphs ako Dwarfs",
        "Dwarfs ako Everything"
    ],
    "9.6": [
        "Crazy is-a Professors",
        "Crazy is-a Hackers",
        "Professors ako Eccentrics",
        "Professors ako Teachers",
        "Hackers ako Eccentrics",
        "Hackers ako Programmers",
        "Eccentrics ako Dwarfs",
        "Teachers ako Dwarfs",
        "Programmers ako Dwarfs",
        "Jackue is-a Weightlifters",
        "Jackue is-a Shotputters",
        "Jackue is-a Athletes",
        "Weightlifters ako Athletes",
        "Weightlifters ako Endomorphs",
        "Shotputters ako Athletes",
        "Shotputters ako Endomorphs",
        "Athletes ako Dwarfs",
        "Endomorphs ako Dwarfs",
        "Dwarfs ako Everything"
    ]
};

function findIndegreeArray(id) {

    cy.nodes().removeData("traversed");
    var inDegree = {};
    var queue = [];
    queue.push(id);
    while (!(queue.length == 0)) {
        var ele = cy.getElementById(queue.shift());
        ele.data("traversed", true);

        inDegree[ele.id()] = ele.incomers().sources("node[traversed]").length;

        var adjacents = ele.outgoers().targets();
        for (var i = 0; i < adjacents.length; i++) {
            var adj = adjacents[i];
            adj.data("traversed", true);
            queue.push(adj.id());
        }
    }

    // get adjacents
    var adjacents = ele.outgoers().targets();

    ele.data("traversed", true);
    for (var i = 0; i < adjacents.length; i++) {
        var adj = adjacents[i];

        inDegree = findIndegreeArray(adj.id(), inDegree);
    }

    return inDegree;
}

function topologicalSortingProcedure(id, precedenceList, inDegree) {

    var ele = cy.getElementById(id);
    if (!inDegree)
        inDegree = findIndegreeArray(id, {});

    // add to precedence list
    precedenceList.push(id);

    // get adjacents
    var adjacents = cy.getElementById(id).outgoers().targets();

    for (var i = 0; i < adjacents.length; i++) {
        var adj = adjacents[i];
        inDegree[adj.id()]--;
        if (inDegree[adj.id()] == 0) { // check whether node is visited
            precedenceList = topologicalSortingProcedure(adj.id(), precedenceList, inDegree);
        }
    }

    return precedenceList;

}




function onPressEnter(e) {
    if(e.which == 13 || e.keyCode == 13)
    {
        doCommand($("#sentence").val());

        $("#sentence").val("");

        return false; // returning false will prevent the event from bubbling up.
    }

    return true;
}

function doCommand(command) {

    var vals = command.split(" ");

    var first = vals[0];
    var second = vals[vals.length - 1];

    if (first.toLowerCase() === "sort") {
        $("#info .title").text(second);
        //var inDegree = findIndegreeArray(second);
        //console.log(inDegree);
        var result = topologicalSortingProcedure(second, []);
        $("#info .content").html(result.join("<br/>"));
        return false;
    } else if (first.toLowerCase() === "clear") {
        cy.elements().remove();
        $("#info .title").text("");
        $("#info .content").text("");
        return false;
    } else if (first.toLowerCase() === "figure") {
        cy.elements().remove();
        var fig = figures[second];
        for (var i = 0; i < fig.length; i++)
            doCommand(fig[i]);
        return false;
    }

    var type = "";
    for (var i = 1; i < vals.length-1; i++ )
        type += vals[i] + " ";

    cy.add([
        { group: "nodes", data: { id: first } },
        { group: "nodes", data: { id: second }  },
        { group: "edges", data: { id: first+second, source: first, target: second, type: type  } }
    ]);

    cy.layout({
        name: 'dagre',
        rankDir: "BT"
    }).run();
}

$(function(){
    

    var cy = window.cy = cytoscape({
        container: document.getElementById('cy'),
        boxSelectionEnabled: false,
        autounselectify: true,
        layout: {
            name: 'dagre'
        },
        style: [
            {
                selector: 'node',
                style: {
                    'content': 'data(id)',
                    'text-opacity': 0.5,
                    'text-valign': 'center',
                    'text-halign': 'right',
                    'background-color': '#11479e'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 4,
                    'target-arrow-shape': 'triangle',
                    'line-color': '#9dbaea',
                    'target-arrow-color': '#9dbaea',
                    'curve-style': 'bezier',
                    "content": "data(type)"
                }
            }
        ],
        elements: {
            nodes: [],
            edges: []
        }
    });
});