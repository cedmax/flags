import React, { Fragment } from "react";
import Link from "./Link";
import { action } from "../helpers";
import { withContext } from "../store/context";

const AnthemBlock = withContext(
  React.memo(
    ({ anthem, dispatch, title }) =>
      anthem && (
        <Fragment>
          <dt>
            <Link
              className="play"
              href={`https://youtube.com/watch?v=${anthem.videoId}`}
              onClick={() => dispatch(action("play", anthem.videoId))}
            >
              <span>play {anthem.title}</span>
            </Link>{" "}
            {title}
          </dt>
          <dd>{anthem.title}</dd>
        </Fragment>
      )
  )
);

const DetailsList = React.memo(({ flag, anthemTitle, partOfTitle }) => (
  <dl>
    {flag.belongsTo && (
      <Fragment>
        <dt>{partOfTitle}</dt>
        <dd>{flag.belongsTo}</dd>
      </Fragment>
    )}
    {flag.name && (
      <Fragment>
        <dt>Flag Name</dt>
        <dd>{flag.name}</dd>
      </Fragment>
    )}
    {flag.adoption && flag.adoption.text && (
      <Fragment>
        <dt>Adopted</dt>
        <dd>{flag.adoption.text}</dd>
      </Fragment>
    )}
    <dt>Aspect Ratio</dt>
    <dd>{flag.ratio}</dd>

    <AnthemBlock title={anthemTitle} anthem={flag.anthem} />

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
));

export default DetailsList;
