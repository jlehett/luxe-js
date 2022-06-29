import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Ergonomic',
    Svg: require('@site/static/img/dev.svg').default,
    description: (
      <>
        Luxe.js's priority is providing web developers with the easiest set of tools for
        building the web app of their dreams. Goodbye boilerplate!
      </>
    ),
  },
  {
    title: 'Opinionated',
    Svg: require('@site/static/img/opinionated.svg').default,
    description: (
      <>
        With this opinionated React metaframework, it's easier than ever to maintain a consistent
        and well-structured codebase.
      </>
    ),
  },
  {
    title: 'Powered by React',
    Svg: require('@site/static/img/react.svg').default,
    description: (
      <>
        Luxe.js is built on top of React, unlocking its full potential to create slick, maintainable
        web apps.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
