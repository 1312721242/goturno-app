import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  boton: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#0066cc',
  },
  textoBoton: {
    fontSize: 16,
    color: '#fff',
  },
    input: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },

});
