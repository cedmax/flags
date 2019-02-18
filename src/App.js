import React, { Component } from "react";
import "./App.css";

const Link = ({ to, children }) => (
  <a href={to} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allFlags: [...props.data],
      filtered: [...props.data],
      filters: [],
      continent: "",
      active: "",
      q: "",
      sortBy: "",
      sorters: ["name", "adoption", "ratio"],
    };

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

  resetFilters = () => {
    this.setState(
      { q: "", sortBy: "", filters: [], continent: "" },
      this.applyFilters
    );
  };

  filterByColor = tag => {
    let { filters } = this.state;

    if (tag) {
      if (filters.includes(tag)) {
        filters = filters.filter(filter => filter !== tag);
      } else {
        filters.push(tag);
      }
    }

    this.setState({ filters }, this.applyFilters);
  };

  filterByContinent = continent => {
    this.setState(
      { continent: this.state.continent === continent ? "" : continent },
      this.applyFilters
    );
  };

  filterString = q => {
    this.setState({ q }, this.applyFilters);
  };

  applyFilters = () => {
    const { filters, continent, allFlags, sortBy, q } = this.state;

    let filtered = !filters.length
      ? [...allFlags]
      : allFlags.filter(({ tags }) => filters.every(tag => tags.includes(tag)));

    if (filters.length && !sortBy) {
      filtered = filtered.sort((flagA, flagB) => {
        const coverageA = filters.reduce((acc, filter) => {
          const { percent } = flagA.colors.find(({ tag }) => tag === filter);
          acc += percent;
          return acc;
        }, 0);

        const coverageB = filters.reduce((acc, filter) => {
          const { percent } = flagB.colors.find(({ tag }) => tag === filter);
          acc += percent;
          return acc;
        }, 0);

        if (coverageA < coverageB) {
          return 1;
        } else {
          return -1;
        }
      });
    }

    if (continent) {
      filtered = filtered.filter(flag => flag.continents.includes(continent));
    }

    if (q) {
      const qF = q.toLowerCase();
      const matches = ["(", " "].map(sign => sign + qF);
      filtered = filtered.filter(flag => {
        const country = flag.country.toLowerCase();
        return (
          country.startsWith(qF) ||
          matches.some(match => country.includes(match))
        );
      });
    }

    this.setState({ filtered }, this.sort);
  };

  sortBy = sortBy => {
    this.setState(
      { sortBy: this.state.sortBy === sortBy ? "" : sortBy },
      this.applyFilters
    );
  };

  sort = () => {
    let { filtered, sortBy } = this.state;
    switch (sortBy) {
      case "name":
        filtered = filtered.sort((a, b) =>
          a.country.toLowerCase().localeCompare(b.country.toLowerCase())
        );
        break;
      case "adoption":
        filtered = filtered.sort((a, b) => a.adoption - b.adoption);
        break;
      case "ratio":
        filtered = filtered.sort((a, b) => {
          const aParts = a.ratio.split(":");
          const aRatio = parseFloat(aParts[0]) / parseFloat(aParts[1]);
          const bParts = b.ratio.split(":");
          const bRatio = parseFloat(bParts[0]) / parseFloat(bParts[1]);

          return bRatio - aRatio;
        });
        break;
      default:
        break;
    }

    this.setState({
      filtered,
    });
  };

  reverse = () => {
    this.setState({
      filtered: this.state.filtered.reverse(),
    });
  };

  render() {
    return (
      <main>
        <h1>Flags of the World</h1>
        <nav>
          <span>
            {this.state.sorters.map(sorter => (
              <button
                key={sorter}
                className={`sorter${
                  this.state.sortBy === sorter ? " selected" : ""
                }`}
                type="button"
                onClick={() => this.sortBy(sorter)}
              >
                <span>{sorter}</span>
              </button>
            ))}
          </span>
          <div className="filters">
            <span>Filter: </span>{" "}
            <input
              type="text"
              value={this.state.q}
              onChange={e => this.filterString(e.target.value)}
            />
          </div>
          <br />
          {this.state.availableContinents.map(continent => (
            <button
              className={`${
                this.state.continent === continent ? "selected" : ""
              }`}
              key={continent}
              onClick={() => this.filterByContinent(continent)}
            >
              <span>{continent}</span>
            </button>
          ))}
          <br />
          {this.state.availableFilters.map(filter => (
            <button
              className={`square${
                this.state.filters.includes(filter) ? " selected" : ""
              }`}
              style={{ color: filter }}
              key={filter}
              onClick={() => this.filterByColor(filter)}
            >
              <span>{filter}</span>
            </button>
          ))}

          <div className="controls">
            <h3 className="count">{this.state.filtered.length} flags</h3>
            <button
              className={`flat${
                !this.state.filters.length &&
                !this.state.q &&
                !this.state.continent &&
                !this.state.sortBy
                  ? " hidden"
                  : ""
              }`}
              onClick={() => this.resetFilters()}
            >
              <span>reset</span>
            </button>
            <button className="flat" onClick={this.reverse}>
              <span>reverse sorting</span>
            </button>
          </div>
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
                          width={150}
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
                            <b>Aspect Ratio</b>
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
