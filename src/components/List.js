import React, { Fragment } from "react";
import Link from "./Link";
import { actionObject } from "../store/helpers";

export default React.memo(({ isSorted, items, dispatch }) => (
  <ul className="list">
    {items.map((flag, i) => {
      const svgUrl = require(`../data/flags/${flag.id}.svg`);

      return (
        <Fragment key={flag.id}>
          {flag.id === "abkhazia" && !isSorted && <hr />}

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
                                id: flag.id,
                                detailView: "map",
                              })
                            );
                          }}
                        >
                          <img
                            alt={`${flag.country} on the globe map`}
                            width="60"
                            src={require(`../data/maps/${flag.id}.png`)}
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
                                  id: flag.id,
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
                            dispatch(actionObject("play", flag.anthem.videoId));
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
));
