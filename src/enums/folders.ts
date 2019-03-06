export enum TlFolder {
    Actions = 'actions',
    Sensor = 'sensors',
    Rules = 'rules',
    Aliases = 'aliases',
    Policies = 'policies'
}

export enum SubFolder {
    ActionsWorkflows = 'workflows',
    ActionsLib = 'lib',
    SensorsCommon = 'common'
}

export enum bootstrapFiles {
    ConfigSchemaTemplate = 'config.schema.yaml',
    ActionMetadataTemplate = 'action.yaml',
    RuleTemplate = 'rule.yaml',
    AliasTemplate = 'alias.yaml',
    SensorTemplate = 'sensor.yaml',
    PolicyTemplate = 'policy.yaml'
}
