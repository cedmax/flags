import React, { Fragment } from "react";
import Link from "./Link";
import { action } from "../helpers";

export default React.memo(({ svgUrl, flag, dispatch }) => (
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
                action("showDetails", {
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
                  action("showDetails", {
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

      <dl>
        {flag.name && (
          <Fragment>
            <dt>Flag Name</dt>
            <dd>{flag.name}</dd>
          </Fragment>
        )}
        <dt>Adopted</dt>
        <dd>{flag.adoption}</dd>
        <dt>Aspect Ratio</dt>
        <dd>{flag.ratio}</dd>
        <dt>
          <a
            className="play"
            href={`#${flag.id}`}
            onClick={e => {
              e.preventDefault();
              dispatch(action("play", flag.anthem.videoId));
            }}
          >
            <span>play {flag.anthem.title}</span>
          </a>{" "}
          Anthem
        </dt>
        <dd>{flag.anthem.title}</dd>
        <dt>Colors</dt>
        <dd className="colors">
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
        </dd>
      </dl>
    </div>
  </div>
));
