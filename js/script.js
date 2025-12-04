/* ============================================
   SCRIPT PRINCIPAL DEL BLOG
   ============================================ */

// Función para dibujar un grafo no dirigido simple
function drawSimpleGraph(canvasId, nodes, edges) {
    const svg = document.getElementById(canvasId);
    if (!svg) return;

    // Limpiar SVG
    svg.innerHTML = '';

    // Crear grupo para líneas
    const edgeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    edgeGroup.setAttribute('id', 'edges');

    // Crear grupo para nodos
    const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodeGroup.setAttribute('id', 'nodes');

    // Dibujar aristas
    edges.forEach(edge => {
        const node1 = nodes[edge.from];
        const node2 = nodes[edge.to];

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', node1.x);
        line.setAttribute('y1', node1.y);
        line.setAttribute('x2', node2.x);
        line.setAttribute('y2', node2.y);
        line.setAttribute('class', 'graph-edge');

        // Si es dirigido, agregar flecha
        if (edge.directed) {
            line.setAttribute('marker-end', 'url(#arrowhead)');
        }

        edgeGroup.appendChild(line);

        // Etiqueta de peso si existe
        if (edge.weight) {
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            const midX = (node1.x + node2.x) / 2;
            const midY = (node1.y + node2.y) / 2;
            label.setAttribute('x', midX);
            label.setAttribute('y', midY - 10);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('class', 'edge-label');
            label.setAttribute('fill', '#f59e0b');
            label.setAttribute('font-weight', 'bold');
            label.textContent = edge.weight;
            edgeGroup.appendChild(label);
        }
    });

    // Dibujar nodos
    nodes.forEach((node, index) => {
        const nodeGroup2 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        nodeGroup2.setAttribute('class', 'graph-node');
        nodeGroup2.setAttribute('id', `node-${index}`);

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', node.x);
        circle.setAttribute('cy', node.y);
        circle.setAttribute('r', 25);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', node.x);
        text.setAttribute('y', node.y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('font-size', '14');
        text.textContent = node.label;

        nodeGroup2.appendChild(circle);
        nodeGroup2.appendChild(text);
        nodeGroup.appendChild(nodeGroup2);
    });

    // Definir marcador para flechas
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '10');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3');
    marker.setAttribute('orient', 'auto');

    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 10 3, 0 6');
    polygon.setAttribute('fill', '#64748b');

    marker.appendChild(polygon);
    defs.appendChild(marker);

    svg.appendChild(defs);
    svg.appendChild(edgeGroup);
    svg.appendChild(nodeGroup);
}

// Función para animar BFS
function animateBFS(canvasId, startNodeIndex, graph) {
    const visited = new Set();
    const queue = [startNodeIndex];
    visited.add(startNodeIndex);

    let step = 0;
    const maxSteps = 20;

    const animate = () => {
        if (queue.length === 0 || step >= maxSteps) {
            console.log('BFS completado');
            return;
        }

        const currentNode = queue.shift();
        const nodeElement = document.getElementById(`node-${currentNode}`);
        if (nodeElement) {
            nodeElement.querySelector('circle').setAttribute('fill', '#10b981');
        }

        // Simular adyacentes
        if (graph[currentNode]) {
            graph[currentNode].forEach(neighbor => {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            });
        }

        step++;
        setTimeout(animate, 800);
    };

    animate();
}

// Función para animar DFS
function animateDFS(canvasId, startNodeIndex, graph) {
    const visited = new Set();

    const dfs = (node, step = 0) => {
        if (step > 20) return;

        visited.add(node);
        const nodeElement = document.getElementById(`node-${node}`);
        if (nodeElement) {
            nodeElement.querySelector('circle').setAttribute('fill', '#ef4444');
        }

        if (graph[node]) {
            graph[node].forEach(neighbor => {
                if (!visited.has(neighbor)) {
                    setTimeout(() => {
                        dfs(neighbor, step + 1);
                    }, 800);
                }
            });
        }
    };

    dfs(startNodeIndex);
}

// Event listeners para los botones interactivos
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar gráficos al cargar la página
    const bfsBtn = document.getElementById('btn-bfs');
    const dfsBtn = document.getElementById('btn-dfs');
    const resetBtn = document.getElementById('btn-reset');

    if (bfsBtn) {
        bfsBtn.addEventListener('click', function () {
            resetGraph();
            const graphData = window.currentGraphData;
            if (graphData) {
                animateBFS('graph-visualization', 0, graphData.adjacencyList);
            }
        });
    }

    if (dfsBtn) {
        dfsBtn.addEventListener('click', function () {
            resetGraph();
            const graphData = window.currentGraphData;
            if (graphData) {
                animateDFS('graph-visualization', 0, graphData.adjacencyList);
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            resetGraph();
        });
    }

    // Scroll to Top Button - Con validación
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    
    if (scrollToTopBtn) {
        // Evento de scroll
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 300) {
                if (!scrollToTopBtn.classList.contains('show')) {
                    scrollToTopBtn.classList.add('show');
                }
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        // Evento de click
        scrollToTopBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Función para resetear el gráfico
function resetGraph() {
    document.querySelectorAll('.graph-node circle').forEach(circle => {
        circle.setAttribute('fill', '#2563eb');
    });
}

// Función para copiar código
function copyCode(buttonElement) {
    const codeBlock = buttonElement.nextElementSibling;
    const code = codeBlock.textContent;
    navigator.clipboard.writeText(code).then(() => {
        const originalText = buttonElement.textContent;
        buttonElement.textContent = '¡Copiado!';
        setTimeout(() => {
            buttonElement.textContent = originalText;
        }, 2000);
    });
}

// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

console.log('Script del blog cargado correctamente');
