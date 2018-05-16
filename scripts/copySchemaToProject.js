import fs from 'fs-extra-promise'; // eslint-disable-line import/no-extraneous-dependencies

const copySchemaToProject = async () => {
  try {
    await fs.copy('./data', '../reactconfbr-app/data');

    console.info('Schema successfully copied to reactconf-app');
  } catch (error) {
    console.error('There was an error while trying to copy schema to confapp', error);
  }
};

copySchemaToProject();
