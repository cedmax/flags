import React, { Component } from "react";
import "./App.css";
import data from "./data/flags.json";

const Link = ({ to, children }) => (
  <a href={to} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

class App extends Component {
  constructor(props) {
    super(props);

    this.state.availableFilters = this.state.allFlags
      .reduce((acc, flag) => {
        acc = acc.concat(flag.tags);

        return [...new Set(acc)];
      }, [])
      .sort();

    this.state.availableContinents = this.state.allFlags
      .reduce((acc, flag) => {
        acc = acc.concat(flag.continents);

        return [...new Set(acc)];
      }, [])
      .sort();
  }
  state = {
    allFlags: data,
    filtered: data,
    filters: [],
    continent: "",
    active: "",
  };

  filterByColor = tag => {
    let { filters } = this.state;

    if (tag) {
      if (filters.includes(tag)) {
        filters = filters.filter(filter => filter !== tag);
      } else {
        filters.push(tag);
      }
    } else {
      filters = [];
    }

    this.setState({ filters }, this.applyFilters);
  };

  filterByContinent = continent => {
    this.setState({ continent }, this.applyFilters);
  };

  applyFilters = () => {
    const { filters, continent, allFlags } = this.state;

    let filtered = !filters.length
      ? allFlags
      : allFlags.filter(({ tags }) => filters.every(tag => tags.includes(tag)));

    if (filters.length === 1) {
      const filter = filters[0];
      filtered = filtered.sort((flagA, flagB) => {
        const colorAToFilter = flagA.colors.find(({ tag }) => tag === filter);
        const colorBToFilter = flagB.colors.find(({ tag }) => tag === filter);
        console.log(colorAToFilter);
        if (colorAToFilter.percent < colorBToFilter.percent) {
          return 1;
        } else {
          return -1;
        }
      });
    }

    if (continent) {
      filtered = filtered.filter(flag => flag.continents.includes(continent));
    }

    this.setState({ filtered });
  };

  render() {
    return (
      <main>
        <h1>Flags of the World</h1>
        <nav>
          <button
            className={`no-square${!this.state.continent ? " selected" : ""}`}
            onClick={() => this.filterByContinent()}
          >
            <span>All</span>
          </button>
          {this.state.availableContinents.map(continent => (
            <button
              className={`no-square${
                this.state.continent === continent ? " selected" : ""
              }`}
              key={continent}
              onClick={() => this.filterByContinent(continent)}
            >
              <span>{continent}</span>
            </button>
          ))}
          <hr />
        </nav>
        <nav>
          {this.state.availableFilters.map(filter => (
            <button
              className={`${
                this.state.filters.includes(filter) ? "selected" : ""
              }`}
              style={{ color: filter }}
              key={filter}
              onClick={() => this.filterByColor(filter)}
            >
              <span>{filter}</span>
            </button>
          ))}
          <button
            className={`no-square flat${
              !this.state.filters.length ? " hidden" : ""
            }`}
            onClick={() => this.filterByColor()}
          >
            <span>reset</span>
          </button>
        </nav>

        <ul className="list">
          {this.state.filtered.map((flag, i) => {
            const svgUrl = require(`./data/flags/${flag.id}.svg`);
            return (
              <li key={flag.id}>
                <div
                  className="flip-container"
                  onMouseOver={() => this.setState({ active: i })}
                >
                  <div className="flipper">
                    <div className="front">
                      <figure>
                        <img
                          width={120}
                          src={svgUrl}
                          alt={`Flag of ${flag.country}`}
                        />
                        <figcaption>{flag.country}</figcaption>
                      </figure>
                    </div>
                    <div className="back">
                      <div
                        style={{
                          backgroundImage: `url(${svgUrl})`,
                        }}
                      >
                        <div className="flag-header">
                          {flag.anthem && (
                            <div className="iframe-placeholder">
                              {i === this.state.active && (
                                <>
                                  <iframe
                                    title={flag.country}
                                    height="80"
                                    width="80"
                                    src={`https://open.spotify.com/embed/track/${flag.anthem.replace(
                                      "spotify:track:",
                                      ""
                                    )}`}
                                  />
                                  <span>anthem</span>
                                </>
                              )}
                            </div>
                          )}
                          <div className="flag-title">
                        <h3>{flag.country}</h3>
                        <small>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://en.wikipedia.org/wiki/${flag.country.replace(
                              /\s/g,
                              "_"
                            )}`}
                          >
                            wiki
                          </a>
                        </small>
                          </div>
                        </div>

                        <ul>
                          {flag.name && (
                            <li>
                              <b>Flag Name</b>
                              <br />
                              <em>{flag.name}</em>
                            </li>
                          )}
                          <li>
                            <b>Adopted</b>
                            <br />
                            <em>{flag.adoption}</em>
                          </li>
                          <li>
                            <b>Ratio</b>
                            <br />
                            <em>{flag.ratio}</em>
                          </li>
                          <li>
                            <b>Colors</b>
                            <br />
                            <div className="colors">
                              {flag.colors.map(({ hex, percent }) => (
                                <div key={hex}>
                                  <span
                                    style={{
                                      backgroundColor: hex,
                                    }}
                                    className="color"
                                  />{" "}
                                  <em>~{percent}%</em>
                                </div>
                              ))}
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <footer>
          All the data is from Wikipedia:
          <br />
          <Link to="https://en.wikipedia.org/wiki/Gallery_of_sovereign_state_flags">
            flags
          </Link>
          ,{" "}
          <Link to="https://en.wikipedia.org/wiki/List_of_sovereign_states_by_date_of_current_flag_adoption">
            adoption years
          </Link>
          ,{" "}
          <Link to="https://en.wikipedia.org/wiki/List_of_sovereign_states_and_dependent_territories_by_continent">
            per continent
          </Link>
          ,{" "}
          <Link to="https://en.wikipedia.org/wiki/List_of_aspect_ratios_of_national_flags">
            ratios
          </Link>
          ,{" "}
          <Link to="https://en.wikipedia.org/wiki/List_of_flag_names">
            names
          </Link>
          .
          <br />
          Anthems from{" "}
          <Link to="https://open.spotify.com/user/nfrancestates/playlist/7w2g4N2CWWeyysqaxWyLTU?si=xjSJ4nmORo-DOaxfJxfNiQ">
            Spotify
          </Link>
          <br />
          <br />
          Made with <span style={{ color: "#C33" }}>❤</span> by{" "}
          <Link to="https://cedmax.com">cedmax</Link>.
        </footer>
      </main>
    );
  }
}

export default App;
