import React, { Component } from "react";
import "./App.css";
import data from "./data/flags.json";

class App extends Component {
  constructor(props) {
    super(props);

    this.state.availableFilters = this.state.allFlags
      .reduce((acc, flag) => {
        acc = acc.concat(flag.tags);

        return [...new Set(acc)];
      }, [])
      .sort();
  }
  state = {
    allFlags: data,
    filtered: data,
    filters: [],
  };

  filterByTag = tag => {
    const { allFlags } = this.state;
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

    const filtered = !filters.length
      ? allFlags
      : allFlags.filter(({ tags }) => filters.every(tag => tags.includes(tag)));

    this.setState({ filtered, filter: tag, filters });
  };

  render() {
    return (
      <main>
        <h1>Flags of the World</h1>
        <nav>
          <button
            className={`no-square${
              !this.state.filters.length ? " selected" : ""
            }`}
            onClick={() => this.filterByTag()}
          >
            <span>All</span>
          </button>
          {this.state.availableFilters.map(filter => (
            <button
              className={`${
                this.state.filters.includes(filter) ? "selected" : ""
              }`}
              style={{ color: filter }}
              key={filter}
              onClick={() => this.filterByTag(filter)}
            >
              <span>{filter}</span>
            </button>
          ))}
        </nav>
        <ul className="list">
          {this.state.filtered.map(flag => {
            const svgUrl = require(`./data/flags/${flag.id}.svg`);
            return (
              <li key={flag.id}>
                <div className="flip-container">
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
          All the information are from Wikipedia.
          <br />
          Made with <span style={{ color: "#C33" }}>❤</span> by{" "}
          <a href="https://cedmax.com">cedmax</a>.
        </footer>
      </main>
    );
  }
}

export default App;
