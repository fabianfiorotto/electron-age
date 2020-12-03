var global = window || global;
global.EntityType = class EntityType {
  static CIVIL        = Symbol('entity_civil'); //??
  static RELIC        = Symbol('entity_relic');
  static RESOURCE     = Symbol('entity_resource');
  static LIVESTOCK    = Symbol('entity_livestock');
  static CAVALRY      = Symbol('entity_cavalry');
  static CAMEL        = Symbol('entity_camel');
  static INFANTRY     = Symbol('entity_infantry');
  static ARCHER       = Symbol('entity_archer');
  static BUILDING     = Symbol('entity_building');
  static SHIP         = Symbol('entity_ship');
  static SIEGE_WEAPON = Symbol('entity_siege_weapon');
  static DEFENSIVE_STRUCTURE = Symbol('entity_defensive_structure');
}
