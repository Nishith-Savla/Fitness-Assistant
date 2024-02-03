def dot_notate(obj, target=None, prefix=""):
    target = target or {}
    prefix = prefix or ""

    for key, value in obj.items():
        if isinstance(value, dict) and value is not None:
            dot_notate(value, target, prefix + key + ".")
        else:
            target[prefix + key] = value

    return target
