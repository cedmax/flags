import React, { Fragment, useReducer } from "react";
import useKey from "@rooks/use-key";
import Modal from "react-modal";
import { getInitialState, reducers } from "./store";
import { actionObject } from "./store/helpers";
import "./App.css";

const Link = ({ to, children, onClick, className }) => (
  <a
    href={to}
    className={className}
    onClick={onClick}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
);

const getSize = ratioString => {
  const ratioParts = ratioString.split(":");
  const ratio = parseFloat(ratioParts[0]) / parseFloat(ratioParts[1]);

  const { clientHeight, clientWidth } = document.documentElement;

  let flagHeight = (clientHeight / 100) * 60;
  let flagWidth = flagHeight / ratio;

  const maxWidth = (clientWidth / 100) * 70;
  if (flagWidth > maxWidth) {
    flagWidth = maxWidth;
    flagHeight = flagWidth * ratio;
  }

  return {
    width: flagWidth,
    height: flagHeight,
  };
};

const App = props => {
  const [state, dispatch] = useReducer(reducers, getInitialState(props.data));
  useKey(["ArrowLeft", "ArrowRight"], e => {
    dispatch(actionObject("navigate", e.key === "ArrowLeft" ? -1 : 1));
  });

  return (
    <main>
      <h1>Flags of the World</h1>
      <nav>
        <span>
          {state.sorters.map(sorter => (
            <button
              key={sorter}
              className={`sorter${state.sortBy === sorter ? " selected" : ""}`}
              type="button"
              onClick={() => dispatch(actionObject("sortBy", sorter))}
            >
              <span>{sorter}</span>
            </button>
          ))}
        </span>
        <div className="filters">
          <span>Filter: </span>{" "}
          <input
            type="text"
            value={state.q}
            onChange={e =>
              dispatch(actionObject("filterString", e.target.value))
            }
          />
        </div>
        <br />
        {state.availableContinents.map(continent => (
          <button
            className={`${state.continent === continent ? "selected" : ""}`}
            key={continent}
            onClick={() =>
              dispatch(actionObject("filterByContinent", continent))
            }
          >
            <span>{continent}</span>
          </button>
        ))}
        <br />
        {state.availableFilters.map(filter => (
          <button
            className={`square${
              state.filters.includes(filter) ? " selected" : ""
            }`}
            style={{ color: filter }}
            key={filter}
            onClick={() => dispatch(actionObject("filterByColor", filter))}
          >
            <span>{filter}</span>
          </button>
        ))}

        <div className="controls">
          <h3 className="count">{state.filtered.length} flags</h3>
          <button
            className={`flat${
              !state.filters.length &&
              !state.q &&
              !state.continent &&
              !state.sortBy
                ? " hidden"
                : ""
            }`}
            onClick={() => dispatch(actionObject("resetFilters"))}
          >
            <span>reset</span>
          </button>
          <button
            className="flat"
            onClick={() => dispatch(actionObject("reverse"))}
          >
            <span>reverse sorting</span>
          </button>
        </div>
      </nav>

      <ul className="list">
        {state.filtered.map((flag, i) => {
          const svgUrl = require(`./data/flags/${flag.id}.svg`);

          return (
            <Fragment key={flag.id}>
              {flag.id === "abkhazia" && !state.sortBy && <hr />}

              <li>
                <div
                  className="flip-container"
                  onMouseEnter={() => dispatch(actionObject("activate", i))}
                  onFocusCapture={() => dispatch(actionObject("activate", i))}
                >
                  <div className="flipper">
                    <div className="front">
                      <figure>
                        <img
                          width={180}
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
                          <div className="flag-map">
                            <Link
                              to={svgUrl}
                              onClick={e => {
                                e.preventDefault();
                                dispatch(
                                  actionObject("showDetails", {
                                    flag,
                                    index: i,
                                    detailView: "map",
                                  })
                                );
                              }}
                            >
                              <img
                                alt={`${flag.country} on the globe map`}
                                width="60"
                                src={require(`./data/maps/${flag.id}.png`)}
                              />
                            </Link>
                          </div>
                          <div className="flag-title">
                            <h3>{flag.country}</h3>
                            <small>
                              <Link
                                to={svgUrl}
                                onClick={e => {
                                  e.preventDefault();
                                  dispatch(
                                    actionObject("showDetails", {
                                      flag,
                                      index: i,
                                      detailView: "flag",
                                    })
                                  );
                                }}
                              >
                                zoom
                              </Link>{" "}
                              <Link
                                to={`https://en.wikipedia.org/wiki/${flag.country.replace(
                                  /\s/g,
                                  "_"
                                )}`}
                              >
                                wiki
                              </Link>
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
                            <a
                              className="play"
                              href={`#${flag.id}`}
                              onClick={e => {
                                e.preventDefault();
                                dispatch(
                                  actionObject("play", flag.anthem.videoId)
                                );
                              }}
                            >
                              <span>play {flag.anthem.title}</span>
                            </a>
                            <b>Anthem</b>
                            <br />
                            <em>{flag.anthem.title}</em>{" "}
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
            </Fragment>
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
        <Link to="https://en.wikipedia.org/wiki/List_of_flag_names">names</Link>
        .
        <br />
        Anthems mostly from{" "}
        <Link to="https://www.youtube.com/user/DeroVolk">
          DeroVolk, on YouTube
        </Link>
        <br />
        <br />
        Made with <span style={{ color: "#C33" }}>❤</span> by{" "}
        <Link to="https://cedmax.com">cedmax</Link>.
      </footer>
      {state.playing && (
        <Modal
          style={{
            overlay: {
              zIndex: 1000,
              background: "transparent",
              pointerEvents: "none",
            },
            content: {
              pointerEvents: "all",
              width: 240,
              height: 135,
              border: 0,
              padding: 0,
              right: 20,
              top: "auto",
              left: "auto",
              bottom: 20,
              overflow: "visible",
            },
          }}
          isOpen={!!state.playing}
          onRequestClose={() => dispatch(actionObject("play", null))}
        >
          <button
            onClick={() => dispatch(actionObject("play", null))}
            className="close"
          >
            <span>close</span>
          </button>
          <iframe
            src={`https://www.youtube.com/embed/${state.playing}?autoplay=1`}
            allow="autoplay"
            frameBorder="0"
            height="100%"
            width="100%"
            title="anthem"
          />
        </Modal>
      )}
      {state.detail && (
        <Modal
          style={{
            overlay: {
              zIndex: 1500,
              background: "rgba(255,255,255,.9)",
            },
            content: {
              ...getSize(
                state.detailView === "flag" ? state.detail.ratio : "1:1"
              ),
              background: "transparent",
              border: "0",
              padding: 0,
              top: "50%",
              left: "50%",
              transform: "translate3d(-50%, -50%, 0)",
              overflow: "visible",
            },
          }}
          isOpen={!!state.detail}
          onRequestClose={() => dispatch(actionObject("hideDetails"))}
          contentLabel={state.detail && state.detail.country}
        >
          <img
            onClick={() => dispatch(actionObject("hideDetails"))}
            height="100%"
            src={
              state.detailView === "flag"
                ? require(`./data/flags/${state.detail.id}.svg`)
                : require(`./data/maps/${state.detail.id}.png`)
            }
            alt={`Flag of ${state.detail.country}`}
          />
          {state.detailView === "map" && (
            <Link
              className="map-credits"
              to={state.detail.map.credits}
              target="_blank"
            >
              map
              <br />
              credits
            </Link>
          )}
          <div className="zoom-controls">
            {state.filtered.length > 1 && (
              <button onClick={() => dispatch(actionObject("navigate", -1))}>
                <span>prev</span>
              </button>
            )}
            <div>
              <h3>{state.detail.country}</h3>
              <small>
                {state.detailView === "map" && (
                  <Link
                    to={require(`./data/flags/${state.detail.id}.svg`)}
                    onClick={e => {
                      e.preventDefault();
                      dispatch(actionObject("updateDetailsView", "flag"));
                    }}
                  >
                    flag
                  </Link>
                )}
                {state.detailView === "flag" && (
                  <Link
                    to={require(`./data/maps/${state.detail.id}.png`)}
                    onClick={e => {
                      e.preventDefault();
                      dispatch(actionObject("updateDetailsView", "map"));
                    }}
                  >
                    map
                  </Link>
                )}
              </small>
            </div>
            {state.filtered.length > 1 && (
              <button onClick={() => dispatch(actionObject("navigate", 1))}>
                <span>next</span>
              </button>
            )}
          </div>
        </Modal>
      )}
    </main>
  );
};

export default App;
