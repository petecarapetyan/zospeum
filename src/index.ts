import { Types, CodegenPlugin } from '@graphql-codegen/plugin-helpers';
import { parse, printSchema, visit, GraphQLSchema } from 'graphql';

export const preset: Types.OutputPreset = {
  buildGeneratesSection: options => {
    console.log("\n\nINCOMING CONFIG", JSON.stringify(options.config));
    const pluginMap: { [name: string]: CodegenPlugin } = {
      ...options.pluginMap
    };
    const plugins = [...options.plugins];
    // const config = {
    //   ...options.config,
    //   // This is for the operations plugin
    //   namespacedImportName: 'foo',
    //   // This is for the client-side runtime plugins
    //   externalFragments: [],
    // };
    // console.log("\n\nINITIAL CONFIG", JSON.stringify(config));
    const output = [];
    const printedSchema = printSchema(options.schemaAst);
    const astNode = parse(printedSchema);
    const visitor = {
      ObjectTypeDefinition: node => {
        return node.name.value;
      },
    };
    const result = visit(astNode, { leave: visitor });
    const nodes = [];
    result.definitions.map(item => {
      if (!(item instanceof Object)) {
        switch (item) {
          case 'Mutation': break;
          case 'Query': break;
          case 'Subscription': break;
          default: nodes.push(item);
        }
      }
    });
    nodes.map(name => {
      console.log('\n\nSCHEMAST\n', JSON.stringify(options.schema));
      const option = {
        filename: `generated/src/${name}.txt`,
        plugins,
        pluginMap,
        schema: parse(printedSchema),
        schemaAst: options.schemaAst,
        documents: options.documents,
        config: {modelViews:nodes, modelName:name}
      }
      output.push(option);
    })
    return output as Types.GenerateOptions[] | null;
  },
};

export const balh = () => {
  return 'blah';
}


export default preset;
