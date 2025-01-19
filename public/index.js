console.log('rendering')

 document.getElementById('generarFormulario').addEventListener('click', function() {
            document.getElementById('generar-formulario').style.display = 'block';
            document.getElementById('cargar-nomina').style.display = 'none';
        });

        document.getElementById('cargarNomina').addEventListener('click', function() {
            document.getElementById('generar-formulario').style.display = 'none';
            document.getElementById('cargar-nomina').style.display = 'block';
        });


        document.getElementById('formulario').addEventListener('submit', async function (event) {
        event.preventDefault(); // Evitar recargar la página

        // Obtener los datos del formulario
        const form = new FormData(this);

        try {
            // Enviar los datos al servidor
            const response = await fetch('/api/formulario', {
                method: 'POST',
                body: form,
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
            a.download = 'formulario.txt'; // Nombre del archivo
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
            console.error('Error al procesar el archivo en el servidor');
            alert('No se pudo procesar el archivo.');
        }
    } catch (error) {
        console.error('Error al cargar el archivo:', error);
        alert('Ocurrió un error al procesar la solicitud.');
    }
});