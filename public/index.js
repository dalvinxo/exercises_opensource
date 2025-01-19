console.log('rendering')


document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario');
    const mesInput = document.getElementById('mes');
    const yearInput = document.getElementById('year');
    const fechaCreacionInput = document.getElementById('fecha-creacion');

    const hoy = new Date();
    fechaCreacionInput.value = hoy.toLocaleDateString('es-DO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    mesInput.value = hoy.getMonth() + 1;
    yearInput.value = hoy.getFullYear();
    
    document.getElementById('generarFormulario').addEventListener('click', function() {
                document.getElementById('generar-formulario').style.display = 'block';
                document.getElementById('cargar-nomina').style.display = 'none';
    });
    
    document.getElementById('cargarNomina').addEventListener('click', function() {
        document.getElementById('generar-formulario').style.display = 'none';
        document.getElementById('cargar-nomina').style.display = 'block';
    });    
    
    formulario.addEventListener('submit', async function (event) {
            event.preventDefault(); 
    
            const mes = parseInt(mesInput.value, 10);
            const year = parseInt(yearInput.value, 10);

            const fechaActual = new Date();
            const fechaIngresada = new Date(year, mes - 1);
            
            if (fechaIngresada > fechaActual) {
                alert('El mes y el año no pueden ser mayores a la fecha actual.');
                return;
            }


            // const form = new FormData(this);

            const formData = new FormData(formulario);
    
            try {
                // Enviar los datos al servidor
                const response = await fetch('/api/formulario', {
                    method: 'POST',
                    body: formData,
                });
    
                // // Procesar la respuesta
                // if (response.ok) {
                //     const result = await response.json();
                //     console.log('Respuesta del servidor:', result);
                //     alert(result.message);
                // } else {
                //     console.error('Error en la respuesta del servidor');
                // }
    
                if (response.ok) {
                // Convertir la respuesta en un blob
                const blob = await response.blob();
    
                // Crear una URL para el archivo descargable
                const url = window.URL.createObjectURL(blob);
    
                // Crear un enlace temporal para descargar el archivo
                const a = document.createElement('a');
                a.href = url;
                a.download = `UNAPEC_NOMINA_${mes}_${year}.txt`; // Nombre del archivo
                document.body.appendChild(a);
                a.click();
    
                // Limpiar el enlace y liberar la URL
                a.remove();
                window.URL.revokeObjectURL(url);
    
                alert('Archivo descargado correctamente.');
            } else {
                console.error('Error en la respuesta del servidor');
                alert('No se pudo descargar el archivo.');
            }
            } catch (error) {
                console.error('Error al enviar el formulario:', error);
            }
    });    
    
    document.getElementById('form-cargar-nomina').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevenir recarga de la página
    
        // Obtener el archivo seleccionado
        const formData = new FormData(this);
    
        try {
            // Enviar el archivo al servidor
            const response = await fetch('/api/cargar-nomina', {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Datos del archivo:', data);
    
                // Mostrar los datos en la tabla
                const tabla = document.getElementById('tabla-nomina');
                const tbody = tabla.querySelector('tbody');
                tbody.innerHTML = ''; // Limpiar contenido previo
    
                data.forEach((fila) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${fila.tipo}</td>
                        <td>${fila.documento || '-'}</td>
                        <td>${fila.cuenta || '-'}</td>
                        <td>${fila.salario || '-'}</td>
                    `;
                    tbody.appendChild(tr);
                });
    
                tabla.style.display = 'block'; // Mostrar la tabla
            } else {
                const error = await response.json()
                console.error('Error al procesar el archivo en el servidor: \n\n '+ error?.message);
                alert('No se pudo procesar el archivo.\n\n'+ error?.message);
            }
            
        } catch (error) {
            console.error('Error al cargar el archivo:', error);
            alert('Ocurrió un error al procesar la solicitud.');
        }
    });

});