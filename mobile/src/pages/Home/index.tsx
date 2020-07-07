import React, { useState, useEffect, ChangeEvent } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Image, Text, StyleSheet, Picker  } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const navigation = useNavigation();

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [loadCities, setLoadCities] = useState('Seleciona uma cidade');

  useEffect(() => {
    const getUF = async () => {
      const response = await axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
      const ufInitials = response.data.map(uf => uf.sigla);
      setUfs(ufInitials);
    }
    getUF();
  }, [])

  useEffect(() => {
    if (selectedUf === '0') {      
      return;
    }

    const getCities = async () => {
      const response = await axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`);

      const cityNames = response.data.map(city => city.nome);
      setCities(cityNames);
      setLoadCities('Seleciona uma cidade')
    }
    getCities();    
  }, [selectedUf])

  const handleSelectUf = (uf: string) => {
    if(uf !== '0') {
      setLoadCities('Carregando cidades...');
    }
    setSelectedUf(uf);
  }

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
  }

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity
    });
  }

  return (
    <ImageBackground 
    source={require('../../assets/home-background.png')} 
    style={styles.container}
    imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
      </View>

      <View style={styles.footer}>

      <Picker        
        selectedValue={selectedUf}
        style={styles.select}
        onValueChange={handleSelectUf}
      >
        <Picker.Item label="Selecione uma UF" value="0" />
        {ufs.sort().map(uf => (
          <Picker.Item key={uf} label={uf} value={uf} />
        ))}
      </Picker>

      <Picker        
        selectedValue={selectedCity}
        style={styles.select}
        onValueChange={handleSelectCity}
      >
        <Picker.Item label={loadCities} value="0" />
        {cities.sort().map(city => (
          <Picker.Item key={city} label={city} value={city} />
        ))}
      </Picker>

        <RectButton style={styles.button} onPress={handleNavigateToPoints }>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#fff" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>

      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,    
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    height: 60,
    backgroundColor: '#fff',
    marginVertical: 8,
    paddingHorizontal: 24,
    fontSize: 16
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;