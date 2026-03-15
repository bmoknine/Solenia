import { useEffect, useState, useMemo } from 'react';
import { listKingdoms, listOrganisations, listCities, listDistricts, listPlaces, listPersons, getPerson, getDistrict, getPlace } from '../api/entities';
import type { Kingdom, Organisation, City, District, Place, Person, OrganisationDetail, PersonDetail, DistrictDetail } from '../api/entities';
import type { HierarchyNavigablePoint } from './Sidebar';
import './HierarchyList.css';

type HierarchyListProps = {
  onSelect: (point: HierarchyNavigablePoint) => void;
};

type ExpandedState = {
  kingdoms: Set<string>;
  organisations: Set<string>;
  cities: Set<string>;
  districts: Set<string>;
};

export function HierarchyList({ onSelect }: HierarchyListProps) {
  const [kingdoms, setKingdoms] = useState<Kingdom[]>([]);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [personDetails, setPersonDetails] = useState<Map<string, PersonDetail>>(new Map());
  const [districtDetails, setDistrictDetails] = useState<Map<string, DistrictDetail>>(new Map());
  const [organisationDetails, setOrganisationDetails] = useState<Map<string, OrganisationDetail>>(new Map());
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<ExpandedState>({
    kingdoms: new Set(),
    organisations: new Set(),
    cities: new Set(),
    districts: new Set(),
  });

  // Charger toutes les données
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [kingdomsData, organisationsData, citiesData, districtsData, placesData, personsData] = await Promise.all([
          listKingdoms(),
          listOrganisations(),
          listCities(),
          listDistricts(),
          listPlaces(),
          listPersons(),
        ]);

        setKingdoms(kingdomsData);
        setOrganisations(organisationsData);
        setCities(citiesData);
        setDistricts(districtsData);
        setPlaces(placesData);
        setPersons(personsData);

        // Charger les détails des organisations pour connaître leurs relations
        const orgDetailsMap = new Map<string, OrganisationDetail>();
        for (const org of organisationsData) {
          try {
            const detail = await import('../api/entities').then(m => m.getOrganisation(org.id));
            orgDetailsMap.set(org.id, detail);
          } catch (e) {
            console.error(`Erreur chargement organisation ${org.id}:`, e);
          }
        }
        setOrganisationDetails(orgDetailsMap);
      } catch (error) {
        console.error('Erreur chargement hiérarchie:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Organiser les données hiérarchiquement
  const hierarchy = useMemo(() => {
    // Grouper les villes par royaume
    const citiesByKingdom = new Map<string, City[]>();
    cities.forEach(city => {
      if (city.kingdomId) {
        if (!citiesByKingdom.has(city.kingdomId)) {
          citiesByKingdom.set(city.kingdomId, []);
        }
        citiesByKingdom.get(city.kingdomId)!.push(city);
      }
    });

    // Grouper les quartiers par ville
    const districtsByCity = new Map<string, District[]>();
    districts.forEach(district => {
      if (!districtsByCity.has(district.cityId)) {
        districtsByCity.set(district.cityId, []);
      }
      districtsByCity.get(district.cityId)!.push(district);
    });

    // Grouper les lieux par quartier, ville et royaume
    const placesByDistrict = new Map<string, Place[]>();
    const placesByCity = new Map<string, Place[]>();
    const placesByKingdom = new Map<string, Place[]>();
    places.forEach(place => {
      if (place.districtId) {
        if (!placesByDistrict.has(place.districtId)) {
          placesByDistrict.set(place.districtId, []);
        }
        placesByDistrict.get(place.districtId)!.push(place);
      } else if (place.cityId) {
        if (!placesByCity.has(place.cityId)) {
          placesByCity.set(place.cityId, []);
        }
        placesByCity.get(place.cityId)!.push(place);
      } else if (place.kingdomId) {
        if (!placesByKingdom.has(place.kingdomId)) {
          placesByKingdom.set(place.kingdomId, []);
        }
        placesByKingdom.get(place.kingdomId)!.push(place);
      }
    });

    // Grouper les personnes par quartier, lieu, ville et royaume
    const personsByDistrict = new Map<string, Person[]>();
    const personsByPlace = new Map<string, Person[]>();
    const personsByCity = new Map<string, Person[]>();
    const personsByKingdom = new Map<string, Person[]>();
    persons.forEach(person => {
      // Note: les personnes peuvent avoir districtId, placeId, cityId, kingdomId
      // On doit charger les détails pour savoir, mais pour simplifier on utilise les données de base
      // On va utiliser une approche différente : on va mapper par les IDs disponibles
    });

    // Grouper les organisations par royaume (via leurs villes)
    const organisationsByKingdom = new Map<string, Organisation[]>();
    organisations.forEach(org => {
      const detail = organisationDetails.get(org.id);
      if (detail?.cities && detail.cities.length > 0) {
        // Trouver le royaume de chaque ville
        detail.cities.forEach(cityRef => {
          const city = cities.find(c => c.id === cityRef.id);
          if (city?.kingdomId) {
            if (!organisationsByKingdom.has(city.kingdomId)) {
              organisationsByKingdom.set(city.kingdomId, []);
            }
            if (!organisationsByKingdom.get(city.kingdomId)!.find(o => o.id === org.id)) {
              organisationsByKingdom.get(city.kingdomId)!.push(org);
            }
          }
        });
      }
    });

    return {
      citiesByKingdom,
      districtsByCity,
      placesByDistrict,
      placesByCity,
      placesByKingdom,
      organisationsByKingdom,
    };
  }, [kingdoms, organisations, cities, districts, places, persons, organisationDetails]);

  const toggleKingdom = (kingdomId: string) => {
    setExpanded(prev => ({
      ...prev,
      kingdoms: new Set(prev.kingdoms.has(kingdomId) ? [...prev.kingdoms].filter(id => id !== kingdomId) : [...prev.kingdoms, kingdomId]),
    }));
  };

  const toggleOrganisation = (orgId: string) => {
    setExpanded(prev => ({
      ...prev,
      organisations: new Set(prev.organisations.has(orgId) ? [...prev.organisations].filter(id => id !== orgId) : [...prev.organisations, orgId]),
    }));
  };

  const toggleCity = (cityId: string) => {
    setExpanded(prev => ({
      ...prev,
      cities: new Set(prev.cities.has(cityId) ? [...prev.cities].filter(id => id !== cityId) : [...prev.cities, cityId]),
    }));
  };

  const toggleDistrict = (districtId: string) => {
    setExpanded(prev => ({
      ...prev,
      districts: new Set(prev.districts.has(districtId) ? [...prev.districts].filter(id => id !== districtId) : [...prev.districts, districtId]),
    }));
  };

  const handleSelect = (kind: HierarchyNavigablePoint['kind'], id: string, name: string) => {
    onSelect({
      id,
      name,
      kind,
      x: 0,
      y: 0,
      targetId: id,
      description: null,
    } as HierarchyNavigablePoint);
  };

  // Charger les détails d'une personne quand nécessaire
  const loadPersonDetails = async (personId: string) => {
    if (personDetails.has(personId)) return;
    try {
      const detail = await getPerson(personId);
      setPersonDetails(prev => new Map(prev).set(personId, detail));
    } catch (e) {
      console.error(`Erreur chargement personne ${personId}:`, e);
    }
  };

  // Charger les détails d'un quartier quand nécessaire
  const loadDistrictDetails = async (districtId: string) => {
    if (districtDetails.has(districtId)) return;
    try {
      const detail = await getDistrict(districtId);
      setDistrictDetails(prev => new Map(prev).set(districtId, detail));
    } catch (e) {
      console.error(`Erreur chargement quartier ${districtId}:`, e);
    }
  };

  // Charger les détails quand un quartier est expandé
  useEffect(() => {
    expanded.districts.forEach(districtId => {
      if (!districtDetails.has(districtId)) {
        loadDistrictDetails(districtId);
      }
    });
  }, [expanded.districts, districtDetails]);

  if (loading) {
    return <div className="hierarchy-list glass">Chargement...</div>;
  }

  return (
    <div className="hierarchy-list glass">
      <h3>Hiérarchie</h3>
      <div className="hierarchy-scroll">
        {kingdoms.map(kingdom => {
          const isKingdomExpanded = expanded.kingdoms.has(kingdom.id);
          const kingdomCities = hierarchy.citiesByKingdom.get(kingdom.id) || [];
          const kingdomOrganisations = hierarchy.organisationsByKingdom.get(kingdom.id) || [];
          const kingdomPlaces = hierarchy.placesByKingdom.get(kingdom.id) || [];

          return (
            <div key={kingdom.id} className="hierarchy-item">
              <div className="hierarchy-row">
                <button
                  className="hierarchy-toggle"
                  onClick={() => toggleKingdom(kingdom.id)}
                  aria-expanded={isKingdomExpanded}
                >
                  {isKingdomExpanded ? '▼' : '▶'}
                </button>
                <button
                  className="hierarchy-label"
                  onClick={() => handleSelect('kingdom', kingdom.id, kingdom.name)}
                >
                  <strong>Royaume : {kingdom.name}</strong>
                </button>
              </div>

              {isKingdomExpanded && (
                <div className="hierarchy-children">
                  {/* Organisations */}
                  {kingdomOrganisations.length > 0 && (
                    <div className="hierarchy-section">
                      {kingdomOrganisations.map(org => {
                        const isOrgExpanded = expanded.organisations.has(org.id);
                        const orgDetail = organisationDetails.get(org.id);
                        return (
                          <div key={org.id} className="hierarchy-item">
                            <div className="hierarchy-row">
                              <button
                                className="hierarchy-toggle"
                                onClick={() => toggleOrganisation(org.id)}
                                aria-expanded={isOrgExpanded}
                              >
                                {isOrgExpanded ? '▼' : '▶'}
                              </button>
                              <button
                                className="hierarchy-label"
                                onClick={() => handleSelect('organisation', org.id, org.name)}
                              >
                                Organisation : {org.name}
                              </button>
                            </div>
                            {isOrgExpanded && orgDetail && (
                              <div className="hierarchy-children">
                                {orgDetail.members && orgDetail.members.length > 0 && (
                                  <div className="hierarchy-section">
                                    {orgDetail.members.map(member => (
                                      <div key={member.id} className="hierarchy-item hierarchy-leaf">
                                        <button
                                          className="hierarchy-label"
                                          onClick={() => handleSelect('person', member.id, member.name)}
                                        >
                                          Personne : {member.name}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {orgDetail.cities && orgDetail.cities.length > 0 && (
                                  <div className="hierarchy-section">
                                    {orgDetail.cities.map(cityRef => (
                                      <div key={cityRef.id} className="hierarchy-item hierarchy-leaf">
                                        <button
                                          className="hierarchy-label"
                                          onClick={() => handleSelect('city', cityRef.id, cityRef.name)}
                                        >
                                          Ville : {cityRef.name}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {orgDetail.places && orgDetail.places.length > 0 && (
                                  <div className="hierarchy-section">
                                    {orgDetail.places.map(placeRef => (
                                      <div key={placeRef.id} className="hierarchy-item hierarchy-leaf">
                                        <button
                                          className="hierarchy-label"
                                          onClick={() => handleSelect('place', placeRef.id, placeRef.name)}
                                        >
                                          Lieu : {placeRef.name}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Villes */}
                  {kingdomCities.map(city => {
                    const isCityExpanded = expanded.cities.has(city.id);
                    const cityDistricts = hierarchy.districtsByCity.get(city.id) || [];
                    const cityPlaces = hierarchy.placesByCity.get(city.id) || [];

                    return (
                      <div key={city.id} className="hierarchy-item">
                        <div className="hierarchy-row">
                          <button
                            className="hierarchy-toggle"
                            onClick={() => toggleCity(city.id)}
                            aria-expanded={isCityExpanded}
                          >
                            {isCityExpanded ? '▼' : '▶'}
                          </button>
                          <button
                            className="hierarchy-label"
                            onClick={() => handleSelect('city', city.id, city.name)}
                          >
                            Ville : {city.name}
                          </button>
                        </div>

                        {isCityExpanded && (
                          <div className="hierarchy-children">
                            {/* Quartiers */}
                            {cityDistricts.map(district => {
                              const isDistrictExpanded = expanded.districts.has(district.id);
                              const districtPlaces = hierarchy.placesByDistrict.get(district.id) || [];
                              const districtDetail = districtDetails.get(district.id);
                              const districtPersons = districtDetail?.persons || [];

                              return (
                                <div key={district.id} className="hierarchy-item">
                                  <div className="hierarchy-row">
                                    <button
                                      className="hierarchy-toggle"
                                      onClick={() => toggleDistrict(district.id)}
                                      aria-expanded={isDistrictExpanded}
                                    >
                                      {isDistrictExpanded ? '▼' : '▶'}
                                    </button>
                                    <button
                                      className="hierarchy-label"
                                      onClick={() => handleSelect('district', district.id, district.name)}
                                    >
                                      Quartier : {district.name}
                                    </button>
                                  </div>

                                  {isDistrictExpanded && (
                                    <div className="hierarchy-children">
                                      {/* Lieux dans le quartier */}
                                      {districtPlaces.length > 0 && (
                                        <div className="hierarchy-section">
                                          {districtPlaces.map(place => (
                                            <div key={place.id} className="hierarchy-item hierarchy-leaf">
                                              <button
                                                className="hierarchy-label"
                                                onClick={() => handleSelect('place', place.id, place.name)}
                                              >
                                                Lieu : {place.name}
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      {/* Personnes dans le quartier */}
                                      {districtPersons.length > 0 && (
                                        <div className="hierarchy-section">
                                          {districtPersons.map(person => (
                                            <div key={person.id} className="hierarchy-item hierarchy-leaf">
                                              <button
                                                className="hierarchy-label"
                                                onClick={() => handleSelect('person', person.id, person.name)}
                                              >
                                                Personne : {person.name}
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}

                            {/* Lieux directement dans la ville */}
                            {cityPlaces.length > 0 && (
                              <div className="hierarchy-section">
                                {cityPlaces.map(place => (
                                  <div key={place.id} className="hierarchy-item hierarchy-leaf">
                                    <button
                                      className="hierarchy-label"
                                      onClick={() => handleSelect('place', place.id, place.name)}
                                    >
                                      Lieu : {place.name}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Lieux directement dans le royaume */}
                  {kingdomPlaces.length > 0 && (
                    <div className="hierarchy-section">
                      {kingdomPlaces.map(place => (
                        <div key={place.id} className="hierarchy-item hierarchy-leaf">
                          <button
                            className="hierarchy-label"
                            onClick={() => handleSelect('place', place.id, place.name)}
                          >
                            Lieu : {place.name}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
