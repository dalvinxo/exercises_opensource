document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario');
    const tablaNomina = document.getElementById('tabla-nomina').querySelector('tbody');
    const previewSection = document.getElementById('preview');
    const generarFormulario = document.getElementById('generar-formulario');
    const pagarButton = document.getElementById('pagarNomina');
    const vistaPreview = document.getElementById('vistaPreview');

    let transacciones = [];

    const fechaCreacionInput = document.getElementById('fecha-creacion');

    const hoy = new Date();
    fechaCreacionInput.value = hoy.toLocaleDateString('es-DO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
    
    formulario.addEventListener('submit', async function (event) {
        event.preventDefault();
        
        const formData = new FormData(formulario);
        
        try {
            const response = await fetch('/api/generar-nomina', {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(formData)),
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                const nomina = await response.json();

                transacciones = nomina.empleados.map(emp => ({
                    cuenta_origen: nomina.cuenta_origen,
                    cuenta_destino: emp.cuenta,
                    monto: emp.salario,
                    fecha_transaccion: nomina.fecha_creacion.split('/').reverse().join('-'),
                }));            

                tablaNomina.innerHTML = '';
                nomina.empleados.forEach(emp => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td>${emp.documento}</td><td>${emp.cuenta}</td><td>${emp.salario}</td>`;
                    tablaNomina.appendChild(tr);
                });
                
                generarFormulario.style.display = 'none';
                previewSection.style.display = 'block';
                vistaPreview.style.display = 'inline';
            } else {
                alert('Error al generar la nómina');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
    
    pagarButton.addEventListener('click', async function () {
        try {
            const response = await fetch('/api/recibir-confirmacion', {
                method: 'POST',
                body: JSON.stringify({ transacciones }),
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                transacciones = [];
                alert('Nómina pagada con éxito');
                location.reload();
            } else {
                alert('Error al procesar el pago');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
