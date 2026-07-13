-- =========================================================
-- 03-create-tables.sql
-- Monitoring system database initialization script
-- =========================================================

-- =========================================================
-- Table: role
-- =========================================================
CREATE TABLE IF NOT EXISTS role (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(50) NOT NULL UNIQUE,
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Table: company
-- type: COMPANY | LABORATORY | UNIVVERSITY
-- =========================================================
CREATE TABLE IF NOT EXISTS company (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    legal_name      VARCHAR(200),
    document        VARCHAR(30),
    type            VARCHAR(30) NOT NULL,
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT company_type_check
        CHECK (type IN ('COMPANY', 'LABORATORY', 'UNIVERSITY'))
);

CREATE INDEX IF NOT EXISTS idx_company_type
    ON company(type);

CREATE UNIQUE INDEX IF NOT EXISTS uq_company_document
    ON company(document)
    WHERE document IS NOT NULL;

-- =========================================================
-- Table: "user"
-- =========================================================
CREATE TABLE IF NOT EXISTS "user" (
    id                  BIGSERIAL PRIMARY KEY,
    name                VARCHAR(150) NOT NULL,
    email               VARCHAR(150) NOT NULL UNIQUE,
    password_hash       TEXT NOT NULL,
    active              BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at       TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    preferred_language  VARCHAR(10) NOT NULL DEFAULT 'en'
);


-- =========================================================
-- Table: unity
-- type: UNIT | LABORATORY | SECTOR | ROOM
-- =========================================================
CREATE TABLE IF NOT EXISTS unity (
    id              BIGSERIAL PRIMARY KEY,
    company_id      BIGINT NOT NULL,
    name            VARCHAR(150) NOT NULL,
    code            VARCHAR(50),
    description     TEXT,
    type            VARCHAR(30) NOT NULL DEFAULT 'UNIT',
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_unity_company
        FOREIGN KEY (company_id)
        REFERENCES company(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT unity_type_check
        CHECK (type IN ('UNIT', 'LABORATORY', 'SECTOR', 'ROOM'))
);

CREATE INDEX IF NOT EXISTS idx_unity_company_id
    ON unity(company_id);

CREATE UNIQUE INDEX IF NOT EXISTS uq_unity_company_code
    ON unity(company_id, code)
    WHERE code IS NOT NULL;

-- =========================================================
-- Table: user_unity
-- User's association with a unity and their role in that unity
-- =========================================================
CREATE TABLE IF NOT EXISTS user_unity (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    unity_id        BIGINT NOT NULL,
    role_id         BIGINT NOT NULL,
    status          VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_user_unity_user
        FOREIGN KEY (user_id)
        REFERENCES "user"(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_user_unity_unity
        FOREIGN KEY (unity_id)
        REFERENCES unity(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_user_unity_role
        FOREIGN KEY (role_id)
        REFERENCES role(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT user_unity_status_check
        CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_user_unity_user_unity
    ON user_unity(user_id, unity_id);

CREATE INDEX IF NOT EXISTS idx_user_unity_user_id
    ON user_unity(user_id);

CREATE INDEX IF NOT EXISTS idx_user_unity_unity_id
    ON user_unity(unity_id);

-- =========================================================
-- Table: Device
-- serial is the PK
-- =========================================================
CREATE TABLE IF NOT EXISTS device (
    serial              VARCHAR(100) PRIMARY KEY,
    name                VARCHAR(150),
    model               VARCHAR(100),
    firmware_version    VARCHAR(50),
    hardware_version    VARCHAR(50),
    status              VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    activated_at        TIMESTAMPTZ,
    last_seen_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT device_status_check
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'DISABLED'))
);

-- =========================================================
-- Table: installation
-- installation history of devices in a unity
-- =========================================================
CREATE TABLE IF NOT EXISTS installation (
    id                  BIGSERIAL PRIMARY KEY,
    unity_id            BIGINT NOT NULL,
    device_serial      VARCHAR(100) NOT NULL,
    installed_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    removed_at          TIMESTAMPTZ,
    status              VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_installation_unity
        FOREIGN KEY (unity_id)
        REFERENCES unity(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_installation_device
        FOREIGN KEY (device_serial)
        REFERENCES device(serial)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT installation_status_check
        CHECK (status IN ('ACTIVE', 'REMOVED', 'INACTIVE')),

    CONSTRAINT installation_removed_after_installed_check
        CHECK (removed_at IS NULL OR removed_at >= installed_at)
);

CREATE INDEX IF NOT EXISTS idx_installation_unity_id
    ON installation(unity_id);

CREATE INDEX IF NOT EXISTS idx_installation_device_serial
    ON installation(device_serial);

-- Ensure only 1 active installation per device
CREATE UNIQUE INDEX IF NOT EXISTS uq_installation_active_device
    ON installation(device_serial)
    WHERE removed_at IS NULL AND status = 'ACTIVE';

-- =========================================================
-- Table: run
-- session / execution / device cycle
-- =========================================================
CREATE TABLE IF NOT EXISTS run (
    id                  BIGSERIAL PRIMARY KEY,
    device_serial      VARCHAR(100) NOT NULL,
    started_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at            TIMESTAMPTZ,
    status              VARCHAR(30) NOT NULL DEFAULT 'RUNNING',
    trigger_source      VARCHAR(30) NOT NULL DEFAULT 'MANUAL',
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    max_temperature         NUMERIC(10,4),
    min_temperature         NUMERIC(10,4),

    CONSTRAINT fk_run_device
        FOREIGN KEY (device_serial)
        REFERENCES device(serial)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT run_status_check
        CHECK (status IN ('RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED')),

    CONSTRAINT run_trigger_source_check
        CHECK (trigger_source IN ('MANUAL', 'AUTOMATIC', 'SCHEDULED')),

    CONSTRAINT run_ended_after_started_check
        CHECK (ended_at IS NULL OR ended_at >= started_at)
);

CREATE INDEX IF NOT EXISTS idx_run_device_serial
    ON run(device_serial);

CREATE INDEX IF NOT EXISTS idx_run_started_at
    ON run(started_at);

-- =========================================================
-- Table: alert_type
-- catalog of alert types
-- =========================================================
CREATE TABLE IF NOT EXISTS alert_type (
    id              BIGSERIAL PRIMARY KEY,
    code            VARCHAR(50) NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    severity        VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT alert_type_severity_check
        CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
);

-- =========================================================
-- Table: alert
-- =========================================================
CREATE TABLE IF NOT EXISTS alert (
    id                      BIGSERIAL PRIMARY KEY,
    device_serial          VARCHAR(100) NOT NULL,
    run_id                  BIGINT,
    alert_type_id           BIGINT NOT NULL,
    occurred_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    title                   VARCHAR(150),
    message                 TEXT,
    value                   NUMERIC(12,4),
    threshold               NUMERIC(12,4),
    acknowledged            BOOLEAN NOT NULL DEFAULT FALSE,
    acknowledged_by_user_id BIGINT,
    acknowledged_at         TIMESTAMPTZ,
    resolved_at             TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_alert_device
        FOREIGN KEY (device_serial)
        REFERENCES device(serial)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_alert_run
        FOREIGN KEY (run_id)
        REFERENCES run(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_alert_type
        FOREIGN KEY (alert_type_id)
        REFERENCES alert_type(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_alert_ack_user
        FOREIGN KEY (acknowledged_by_user_id)
        REFERENCES "user"(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT alert_acknowledged_consistency_check
        CHECK (
            (
                acknowledged = FALSE
                AND acknowledged_at IS NULL
                AND acknowledged_by_user_id IS NULL
            )
            OR
            (
                acknowledged = TRUE
                AND acknowledged_at IS NOT NULL
                AND acknowledged_by_user_id IS NOT NULL
            )
        )
);

CREATE INDEX IF NOT EXISTS idx_alert_device_serial
    ON alert(device_serial);

CREATE INDEX IF NOT EXISTS idx_alert_type_id
    ON alert(alert_type_id);

CREATE INDEX IF NOT EXISTS idx_alert_occurred_at
    ON alert(occurred_at);

CREATE INDEX IF NOT EXISTS idx_alert_run_id
    ON alert(run_id);

-- =========================================================
-- Table: device_data
-- device readings / telemetry
-- =========================================================
CREATE TABLE IF NOT EXISTS device_data (
    id                  BIGSERIAL PRIMARY KEY,
    device_serial      VARCHAR(100) NOT NULL,
    run_id              BIGINT,
    recorded_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    temperature         NUMERIC(10,4),
    battery_level       NUMERIC(10,4),
    signal_strength     INTEGER,
    payload_json        JSONB,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_device_data_device
        FOREIGN KEY (device_serial)
        REFERENCES device(serial)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_device_data_run
        FOREIGN KEY (run_id)
        REFERENCES run(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_device_data_device_serial
    ON device_data(device_serial);

CREATE INDEX IF NOT EXISTS idx_device_data_recorded_at
    ON device_data(recorded_at);

CREATE INDEX IF NOT EXISTS idx_device_data_run_id
    ON device_data(run_id);

CREATE INDEX IF NOT EXISTS idx_device_data_device_recorded_at
    ON device_data(device_serial, recorded_at);

-- =========================================================
-- Triggers para updated_at
-- =========================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_company_set_updated_at ON company;
CREATE TRIGGER trg_company_set_updated_at
BEFORE UPDATE ON company
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_user_set_updated_at ON "user";
CREATE TRIGGER trg_user_set_updated_at
BEFORE UPDATE ON "user"
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_unity_set_updated_at ON unity;
CREATE TRIGGER trg_unity_set_updated_at
BEFORE UPDATE ON unity
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_device_set_updated_at ON device;
CREATE TRIGGER trg_device_set_updated_at
BEFORE UPDATE ON device
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- Optional comments
-- =========================================================
COMMENT ON TABLE role IS 'System access profiles';
COMMENT ON TABLE company IS 'Company or laboratory';
COMMENT ON TABLE unity IS 'Unit / sector / location belonging to a company';
COMMENT ON TABLE user_unity IS 'User''s association with a unity and their role in that unity';
COMMENT ON TABLE device IS 'Monitored physical device';
COMMENT ON TABLE installation IS 'Installation history of devices in unities';
COMMENT ON TABLE run IS 'Device session / execution / cycle';
COMMENT ON TABLE alert_type IS 'Catalog of alert types';
COMMENT ON TABLE alert IS 'Alerts issued by the system/device';
COMMENT ON TABLE device_data IS 'Device readings / telemetry';